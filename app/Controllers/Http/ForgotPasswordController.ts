import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForgotPassword from 'App/Mailers/ForgotPassword'
import User from 'App/Models/User'
import ForgotValidator from 'App/Validators/ForgotValidator-password-validators/ForgotValidator'
import RecoveryValidator from 'App/Validators/ForgotValidator-password-validators/RecoveryValidator'
import crypto from 'crypto'

export default class ForgotPasswordController {
  public async store({ request }: HttpContextContract) {
    const data = await request.validate(ForgotValidator)
    const user = await User.findByOrFail('email', data.email)
    const token = crypto.randomBytes(12).toString('hex')

    user.rememberMeToken = token
    await user.save()
    
    await new ForgotPassword(user, token).sendLater()
  }

  public async update({ request, response }: HttpContextContract) {
    const data = await request.validate(RecoveryValidator)

    const user = await User.findByOrFail('remember_me_token', data.token)

    user.password = data.password
    user.rememberMeToken = undefined
    await user.save()

    return response.json({ ok: true })
  }
}