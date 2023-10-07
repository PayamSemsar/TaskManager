import {inject} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  getModelSchemaRef,
  response
} from '@loopback/rest';
import {authorized, dateNow} from '../helpers';

export class DateController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) { }

  @get('/date-now')
  @response(200, {
    description: 'نشان دادن زمان حال از بک اند',
    content: {
      'application/json': {
        schema: {
          type: 'number',
          items: getModelSchemaRef(Number, {includeRelations: true}),
        },
      },
    },
  })
  async GetDateNow(): Promise<number> {
    const token: any = this.request.headers.authorization; authorized(token);

    console.log(`/date-now`);
    return dateNow()
  }
}
