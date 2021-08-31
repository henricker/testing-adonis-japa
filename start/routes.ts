import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/users', 'UsersController.store')
Route.post('/session', 'SessionsController.store')
Route.post('/forgot-password', 'ForgotPasswordController.store')
Route.put('/forgot-password', 'ForgotPasswordController.update')

Route.group(() => {
  Route.resource('/tasks', 'TasksController').apiOnly()
}).middleware(['auth'])
