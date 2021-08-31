import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class ForgotPassword extends BaseMailer {

  constructor(private user: User, private token: string) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .subject('Reset password')
      .from('tgl@suport.com', 'TGL Bets')
      .to(this.user.email)
      .htmlView('mails/forgot-password', {
        email: this.user.email,
        token: this.token
      })
  }
}
