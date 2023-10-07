import {authorized, dateEndDate, dateNow} from '../helpers';

import {UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  RestBindings,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {TaskActivite} from '../models';
import {TaskActiviteRepository, TaskRepository, UserCredentialsRepository} from '../repositories';

export class TaskActiviteControllerController {
  constructor(
    @repository(TaskActiviteRepository)
    public taskActiviteRepository: TaskActiviteRepository,
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserCredentialsRepository) protected userCredentialsRepository: UserCredentialsRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request

  ) { }

  @post('/create-task-activite')
  @response(200)
  async CreateTaskActivite(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TaskActivite, {
            exclude: ['taskActiviteID', 'taskActiviteStatus', 'taskActiviteCreateDate', 'taskActiviteDescription', 'taskActiviteEndDate', 'taskActualEndDate'],
          }),
        },
      },
    })
    taskActivite: TaskActivite
  ): Promise<void> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/create-task-activite`);
    if (!taskActivite.userID) throw new HttpErrors[422]('مقادیر نمیتوانند خالی باشند');
    if (!taskActivite.taskID) throw new HttpErrors[422]('مقادیر نمیتوانند خالی باشند');

    const dataTaskID = await this.taskRepository.findById(taskActivite.taskID);
    if (dataTaskID.taskStatus == true) throw new HttpErrors[422]('این تسک قبلا برای کاربری ثبت شده است');

    taskActivite.taskActiviteEndDate = Number(dateEndDate(dataTaskID?.taskEndDay))
    taskActivite.taskActiviteCreateDate = (dateNow())

    await this.taskActiviteRepository.create(taskActivite);
    await this.taskRepository.updateById(taskActivite.taskID, {label: dataTaskID.label, taskStatus: true})
  }

  @get('/task-activites/count/{status}')
  @response(200, {
    content: {'application/json': {schema: CountSchema}},
  })
  async CountTaskActiviteByStatus(
    @param.path.string('status') status: boolean,
  ): Promise<Count> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/task-activites/count/${status}`);

    return await this.taskActiviteRepository.count({taskActiviteStatus: status});
  }


  @get('/get-task-activites/{limit}/{skip}/{status}')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TaskActivite),
        },
      },
    },
  })
  async FindTaskActiviteByLimitAndSkipAndStatus(
    @param.path.string('status') status: boolean,
    @param.path.string('limit') limit: number,
    @param.path.string('skip') skip: number,
  ): Promise<object[]> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/get-task-activites/${limit}/${skip}/${status}`);
    return await this.taskActiviteRepository.find({
      limit, skip, where: {taskActiviteStatus: status},
      include: [
        {
          relation: 'user',
          scope: {
            fields: {
              userId: true,
              label: true
            },
          }
        },
        {
          relation: 'task',
          scope: {
            fields: {
              taskID: true,
              label: true,
              taskDescription: true
            }
          }
        }
      ]
    })
  }



  @get('/get-task-activites-by-time/{startDate}/{endDate}/{status}')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TaskActivite),
        },
      },
    },
  })
  async FindAllTaskActiviteByTimeAndStatus(
    @param.path.string('status') status: boolean,
    @param.path.string('startDate') startDate: number,
    @param.path.string('endDate') endDate: number,
  ): Promise<object[]> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/get-task-activites-by-time/${startDate}/${endDate}/${status}`);
    return await this.userRepository.find({
      fields: {
        label: true,
        userId: true
      },
      include: [{
        relation: 'taskActivite',
        scope: {
          where: {taskActiviteCreateDate: {between: [startDate, endDate]}, taskActiviteStatus: status},
          fields: {
            taskActiviteID: false,
          },
          include: [{
            relation: 'task',
            scope: {
              fields: {
                label: true,
                taskDescription: true
              }
            }
          }]
        }
      }]
    })

  }

  @get('/get-task-activite-by-time/{startDate}/{endDate}')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TaskActivite, {
            exclude: ['taskActiviteID']
          }),
        },
      },
    },
  })
  async FindAllTaskActivite(
    @param.path.string('startDate') startDate: number,
    @param.path.string('endDate') endDate: number,
  ): Promise<object[]> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/get-task-activite-by-time/${startDate}/${endDate}`);
    return await this.userRepository.find({
      fields: {
        label: true,
        userId: true
      },
      include: [{
        relation: 'taskActivite',
        scope: {
          where: {taskActiviteCreateDate: {between: [startDate, endDate]}},
          fields: {
            taskActiviteID: false
          },
          include: [{
            relation: 'task',
            scope: {
              fields: {
                label: true
              }
            }
          }]
        }
      }]
    })

  }


  @get('/get-all-task-activite/{startDate}/{endDate}')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TaskActivite, {
            exclude: ['taskActiviteID']
          }),
        },
      },
    },
  })
  async FindAllTaskActiviteByTime(
    @param.path.string('startDate') startDate: number,
    @param.path.string('endDate') endDate: number,
  ): Promise<object[]> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/get-all-task-activite/${startDate}/${endDate}`);

    return await this.userRepository.find({
      fields: {
        userID: false,
        password: false
      },
      include: [{
        relation: 'taskActivite',
        scope: {
          where: {taskActiviteCreateDate: {between: [startDate, endDate]}},
          fields: {
            taskActiviteID: false
          },
          include: [{
            relation: 'task',
            scope: {
              fields: {
                taskStatus: false
              }
            }
          }]
        }
      }]
    })
  }


  @patch('/task-activite-ended/{id}')
  @response(204)
  async ChangeEndedTaskActiviteById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TaskActivite, {
            partial: true,
            exclude: ['taskActiviteID', 'taskActiviteStatus', 'taskActiviteCreateDate', 'taskActualEndDate', 'taskActiviteEndDate', 'taskID', 'userID']
          }),
        },
      },
    })
    taskActivite: TaskActivite,
  ): Promise<void> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/task-activite-ended/${id}`);
    if (!taskActivite.taskActiviteDescription) throw new HttpErrors[422]('دیسکریپشن نمیتواند خالی باشد');
    await this.taskActiviteRepository.updateById(id, {taskActiviteStatus: true, taskActualEndDate: dateNow(), taskActiviteDescription: taskActivite.taskActiviteDescription});
  }
}
