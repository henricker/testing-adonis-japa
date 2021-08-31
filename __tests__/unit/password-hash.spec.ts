import test from 'japa'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'


test.group('Password hashing', (group) => {

  group.before(async () => {
    await Database.beginGlobalTransaction()
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure user has been encrypted password after save', async (assert) => {
    const user = await User.create({
      email: 'henricker@email.com',
      password: 'secret'
    })

    assert.notEqual(user.password, 'secret')
    assert.equal(true, await user.checkPassword('secret'))
  })
})
