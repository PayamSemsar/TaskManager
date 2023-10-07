import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {UserCredentials, UserCredentialsRelations} from '../models';
export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.userCredentialID,
  UserCredentialsRelations
> {
  // public readonly taskActivite: BelongsToAccessor<TaskActivite, string>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    // @repository.getter('TaskActiviteRepository') protected taskActiviteRepositoryGetter: Getter<TaskActiviteRepository>,
  ) {
    super(UserCredentials, dataSource);

    // this.taskActivite = this.createBelongsToAccessorFor('taskActivite', taskActiviteRepositoryGetter)
    // this.registerInclusionResolver('taskActivite', this.taskActivite.inclusionResolver);
  }
}
