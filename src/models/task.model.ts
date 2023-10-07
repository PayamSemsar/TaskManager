import {Entity, model, property} from '@loopback/repository';

@model()
export class Task extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  taskID: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      fieldName: "taskTitle",
    },
    jsonSchema: {
      minLength: 1,
      maxLength: 50,
      errorMessage: {
        minLength: 'label should More than 1 characters.',
        maxLength: 'label should Less than 50 characters.',
      },
    }
  })
  label: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 1,
      maxLength: 255,
      errorMessage: {
        minLength: 'taskDescription should More than 1 characters.',
        maxLength: 'taskDescription should Less than 255 characters.',
      },
    }
  })
  taskDescription: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  taskStatus: boolean;

  @property({
    type: 'number',
    required: true,
  })
  taskCreatedDate: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
      maximum: 30,
      errorMessage: {
        minLength: 'taskEndDay should More than 1 characters.',
        maxLength: 'taskEndDay should Less than 30 characters.',
      },
    }
  })
  taskEndDay: number;

  // @hasMany(() => TaskActivite, {keyTo: 'taskID'})
  // taskActivites: TaskActivite[];

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
}

export type TaskWithRelations = Task & TaskRelations;
