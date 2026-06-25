import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDTO } from '../user.dto';
import { UserService } from '../user.service';

export class CreateUserCommand {
  constructor(public readonly createUserDTO: CreateUserDTO) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

  execute(command: CreateUserCommand) {
    return this.userService.createUser(command.createUserDTO);
  }
}
