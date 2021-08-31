import test from 'japa'
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database'


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', (group) => {

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure user has been created', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      email: 'henricker@email.com',
      password: '1234',
      password_confirmation: '1234'
    })

    // console.log(response.body)
    assert.exists(response.body.user)
    assert.property(response.body.user, 'id')
  })

  test('ensure user has not created when email already exists', async (assert) => {
    //using user of last test to testing email property 
    await supertest(BASE_URL).post('/users').send({
      email: 'henricker@email.com',
      password: '1234',
      password_confirmation: '1234'
    })

    const response = await supertest(BASE_URL).post('/users').send({
      email: 'henricker@email.com',
      password: '1234',
      password_confirmation: '1234'
    })


    assert.exists(response.body.errors)
    assert.propertyVal(response.body.errors[0], 'message', 'email already exists')
  })

  test('ensure user not been created when password and password_confirmation does not match', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      email: 'email@email.com',
      password: '1234',
      password_confirmation: '12345'
    })

    assert.exists(response.body.errors)
    assert.propertyVal(response.body.errors[0], 'message', 'confirmed validation failed')
  })

  test('ensure user not been created when email is invalid', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      email: 'mail,om',
      password: '1234',
      password_confirmation: '12345'
    })

    assert.exists(response.body.errors)
    assert.property(response.body.errors[0], 'message')
    assert.propertyVal(response.body.errors[0], 'message', 'email is invalid')
  })

  test('ensure user not been created when password is not provided', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      email: 'henricker@email.com'
    })

    assert.exists(response.body.errors)
    assert.property(response.body.errors[0], 'message')
    assert.propertyVal(response.body.errors[0], 'message', 'The password is required')
  })

  test('ensure user not been created when email is not provided', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      password: '12345'
    })

    assert.exists(response.body.errors)
    assert.property(response.body.errors[0], 'message')
    assert.propertyVal(response.body.errors[0], 'message', 'The email is required')
  })
})