import {Entity, model, property} from '@loopback/repository';

@model()
export class GetUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  userID: string;

  @property({
    type: 'string',
    required: true,
  })
  label: string;

  constructor(data?: Partial<GetUser>) {
    super(data);
  }
}

export interface GetUserRelations {
  // describe navigational properties here
}

export type GetUserWithRelations = GetUser & GetUserRelations;
