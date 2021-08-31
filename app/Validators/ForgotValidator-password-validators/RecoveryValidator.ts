import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RecoveryValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
		token: schema.string({trim: true}, [
			rules.exists({ table: 'users', column: 'remember_me_token' })
		]),
		password: schema.string({trim: true}, [
			rules.confirmed()
		])
  })

  public messages = {
		'required': '{{ field }} is required',
		'token.exists': 'token not found'
	}
}
