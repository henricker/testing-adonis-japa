import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
		email: schema.string({ trim: true }, [
			rules.email(),
			rules.unique({ table: 'users', column: 'email' })
		]),
		password: schema.string({ trim: true }, [
			rules.confirmed()
		])
  })

  public messages = {
		'required': 'The {{ field }} is required',
		'email.unique': 'email already exists',
		'email.email': 'email is invalid'
	}
}
