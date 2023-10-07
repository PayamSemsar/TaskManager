import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Task, TaskActivite, TaskActiviteRelations, User} from '../models';
import {TaskRepository} from './task.repository';
import {UserRepository} from './user.repository';
export class TaskActiviteRepository extends DefaultCrudRepository<
  TaskActivite,
  typeof TaskActivite.prototype.taskActiviteID,
  TaskActiviteRelations
> {

  public readonly user: BelongsToAccessor<User, string>;
  public readonly task: BelongsToAccessor<Task, string>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,

    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>,
  ) {
    super(TaskActivite, dataSource);


    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.task = this.createBelongsToAccessorFor('task', taskRepositoryGetter,);

    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('task', this.task.inclusionResolver);
  }
}
