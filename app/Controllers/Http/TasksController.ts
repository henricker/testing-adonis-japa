import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskValidator'

export default class TasksController {
  public async index ({ auth }: HttpContextContract) {
    const user = await auth.use('api').authenticate()

    await user.load('tasks')

    return { user_id: user.id, tasks: user.tasks }
  }

  public async store ({ request, auth }: HttpContextContract) {
    const userId = (await auth.use('api').authenticate()).id
    const data = await request.validate(TaskValidator)

    const task = await Task.create({userId, title: data.title, description: data.description })

    return { task: task.serialize() }
  }

}
