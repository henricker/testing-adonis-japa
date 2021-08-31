import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Auth', (group) => {

  group.before(async () => {
    await Database.beginGlobalTransaction()
    await User.create({
      email: 'henricker@email.com',
      password: '1234',
    })
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure user has been authenticated with token jwt', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: 'henricker@email.com',
      password: '1234'
    })

    assert.property(response.body, 'token')
  })

  test('ensure user has been not authenticated when email or password does not match', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: 'henrickerr@email.com',
      password: '123'
    })
    
    assert.notProperty(response.body, 'token')
    assert.exists(response.body.errors)
    assert.propertyVal(response.body.errors[0], 'message', 'Invalid user credentials')
  })
})