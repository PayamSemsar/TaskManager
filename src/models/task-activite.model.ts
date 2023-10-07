import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {Task} from './task.model';
import {User} from './user.model';

@model()
export class TaskActivite extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  taskActiviteID: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  @belongsTo(() => Task, {name: 'task', keyTo: '_id'})
  taskID: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  @belongsTo(() => User, {name: 'user', keyTo: 'userId'})
  userID: string;

  @property({
    type: 'boolean',
    required: true,
    default: false
  })
  taskActiviteStatus: boolean;

  @property({
    type: 'number',
    required: true,
  })
  taskActiviteCreateDate: number;

  @property({
    type: 'number',
    required: true,
  })
  taskActiviteEndDate: number;

  @property({
    type: 'number',
    default: ''
  })
  taskActualEndDate?: number;

  @property({
    type: 'string',
    default: ''
  })
  taskActiviteDescription?: string;

  @hasMany(() => User, {keyFrom: 'userId'})
  users: User[];


  constructor(data?: Partial<TaskActivite>) {
    super(data);
  }
}

export interface TaskActiviteRelations {
}

export type TaskActiviteWithRelations = TaskActivite & TaskActiviteRelations;
