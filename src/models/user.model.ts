import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {TaskActivite} from './task-activite.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  userID: string;

  @belongsTo(() => TaskActivite, {name: 'taskActivite', keyTo: 'userID'})
  userId: string;
  @hasMany(() => TaskActivite, {name: 'taskActivite', keyTo: 'userID', keyFrom: 'userId'})
  TaskActivites: TaskActivite[];


  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 1,
      maxLength: 35,
      errorMessage: {
        minLength: 'label should More than 1 characters.',
        maxLength: 'label should Less than 35 characters.',
      },
    }
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      fieldName: "userFullName",
    },
    jsonSchema: {
      minLength: 1,
      maxLength: 35,
      errorMessage: {
        minLength: 'label should More than 1 characters.',
        maxLength: 'label should Less than 35 characters.',
      },
    }
  })
  label: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      fieldName: "userPassword",
    },
    jsonSchema: {
      minLength: 8,
      errorMessage: {
        minLength: 'label should More than 8 characters.',
      },
    }
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      fieldName: "userPhoneNumber",
    },
    jsonSchema: {
      minLength: 11,
      maxLength: 11,
      errorMessage: {
        minLength: 'PhoneNumber should 11 characters.',
        maxLength: 'PhoneNumber should 11 characters.',
      },
    }
  })
  phoneNumber: string;


  // @hasMany(() => TaskActivite, {keyTo: 'userID'})
  // taskActivites: TaskActivite[];



  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
