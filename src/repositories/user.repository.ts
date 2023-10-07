import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {TaskActivite, User, UserRelations} from '../models';
import {TaskActiviteRepository} from './task-activite.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.userID,
  UserRelations
> {
  // public readonly taskActivite: BelongsToAccessor<TaskActivite, string>;
  public readonly taskActivite: HasManyRepositoryFactory<TaskActivite, string>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('TaskActiviteRepository') protected taskActiviteRepositoryGetter: Getter<TaskActiviteRepository>,

  ) {
    super(User, dataSource);

    this.taskActivite = this.createHasManyRepositoryFactoryFor('taskActivite', taskActiviteRepositoryGetter)
    this.registerInclusionResolver('taskActivite', this.taskActivite.inclusionResolver);
  }
}
