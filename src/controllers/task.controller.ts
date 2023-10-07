import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  Request,
  RestBindings,
  get,
  getModelSchemaRef,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {authorized, dateNow} from '../helpers';
import {Task} from '../models';
import {TaskRepository} from '../repositories';


export class TaskControllerController {
  constructor(
    @repository(TaskRepository) public taskRepository: TaskRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) { }

  @post('/create-task')
  @response(200)
  async CreateTask(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            exclude: ['taskID', 'taskCreatedDate', 'taskStatus'],
          }),
        },
      },
    })
    task: Task,
  ): Promise<void> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log('/create-task');
    task.taskCreatedDate = dateNow()
    await this.taskRepository.create(task)
  }

  @get('/get-tasks')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Task, {
            exclude: ['taskCreatedDate', 'taskStatus']
          }),
        },
      },
    },
  })
  async FindAllTask(): Promise<Task[]> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log('/get-tasks');
    return await this.taskRepository.find({where: {taskStatus: false}, fields: {taskStatus: false, taskCreatedDate: false}});
  }


  // @get('/tasks/count')
  // @response(200, {
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Task) where?: Where<Task>,
  // ): Promise<Count> {
  //   return this.taskRepository.count(where);
  // }
}
