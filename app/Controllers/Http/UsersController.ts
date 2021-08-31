import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/user-validators/CreateUserValidator'

export default class UsersController {
  public async store({ request }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)
    const user = await User.create({ email: data.email, password: data.password })
    return { user: user.serialize() }
  }
}
