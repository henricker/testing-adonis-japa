import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Task', (group) => {

  group.before(async () => {
    await Database.beginGlobalTransaction()
    await User.create({
      email: 'henricker@email.com',
      password: '1234'
    })
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure to allow user can access tasks resource when has been authenticated', async (assert) => {
    const responseSession = await supertest(BASE_URL).post('/session').send({
      email: 'henricker@email.com',
      password: '1234'
    })

    const token = responseSession.body.token

    const response = await supertest(BASE_URL).get('/tasks').set('Authorization', `Bearer ${token}`)

    assert.exists(response.body.user_id)
    assert.exists(response.body.tasks)
    assert.isArray(response.body.tasks)
    assert.equal(response.status, 200)
  })

  test('ensure to not allow user to access tasks resouces when has not been authenticated', async (assert) => {
    const response = await supertest(BASE_URL).get('/tasks')


    assert.equal(response.status, 401)
    assert.exists(response.body.errors)
    assert.propertyVal(response.body.errors[0], 'message', 'E_UNAUTHORIZED_ACCESS: Unauthorized access')
  })

  test('ensure allow user to create a new task when has been authenticated', async (assert) => {
    const responseSession = await supertest(BASE_URL).post('/session').send({
      email: 'henricker@email.com',
      password: '1234'
    })

    const token = responseSession.body.token

    const response = await supertest(BASE_URL).post('/tasks').set('Authorization', `Bearer ${token}`).send({
      title: 'Birthday of my friend',
      description: 'buy a gift for my friend'
    })

    assert.equal(response.status, 200)
    assert.exists(response.body.task)
    assert.equal(response.body.task.title, 'Birthday of my friend')
    assert.equal(response.body.task.description, 'buy a gift for my friend')
  })

})