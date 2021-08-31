import Mail from '@ioc:Adonis/Addons/Mail';
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import test from 'japa'
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Recovery password', (group) => {
  group.before(async () => {
    await Database.beginGlobalTransaction()
    await User.create({
      email: 'henricker@email.com',
      password: '1234'
    })
  })

  group.afterEach(async () => {
    Mail.restore()
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure send mail when has been request of replacement password', async (assert) => {
    
    //It's like an event listener, when the email is sent, we have its reference
    Mail.trap(async (message) => {
      assert.deepEqual(message.to, [{ address: 'henricker@email.com' }])
      assert.deepEqual(message.from?.address, 'tgl@suport.com')
      assert.deepEqual(message.from?.name, 'TGL Bets')
      assert.deepEqual(message.subject, 'Reset password')

      const token = message.html?.match(/[a-zA-Z0-9]{24}/)?.slice(0)[0]

      const user = await User.findByOrFail('email', 'henricker@email.com')
      assert.equal(user.rememberMeToken, token)
    })    

    await supertest(BASE_URL).post('/forgot-password').send({
      email: 'henricker@email.com'
    })
  })

  test('ensure recovery password when has been request of replacement password', async (assert) => {
      const token = (await User.findByOrFail('email', 'henricker@email.com')).rememberMeToken

      const response = await supertest(BASE_URL).put('/forgot-password').send({
        token,
        password: '123',
        password_confirmation: '123'
      })

      const user = await User.findByOrFail('email', 'henricker@email.com')
      
      assert.equal(true, await user.checkPassword('123'))
      assert.equal(response.status, 200)
  
  })

  test('ensure not recovery password when has been request of replacement password with token invalid', async (assert) => {
    await supertest(BASE_URL).post('/forgot-password').send({
      email: 'henricker@email.com'
    })

    const response = await supertest(BASE_URL).put('/forgot-password').send({
      token: 'invalid token here',
      password: '1234',
      password_confirmation: '1234'
    })

    const user = await User.findByOrFail('email', 'henricker@email.com')

    assert.equal(false, await user.checkPassword('1234'))
    assert.exists(response.body.errors)
    assert.propertyVal(response.body.errors[0], 'message', 'token not found')
  })  
})