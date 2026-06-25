import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../user.entity';
import { UserService } from '../user.service';

export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private userService: UserService) {}

  execute(query: GetUserByEmailQuery): Promise<User> {
    return this.userService.findUserByEmail(query.email);
  }
}
