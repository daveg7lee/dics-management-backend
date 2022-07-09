import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'password', 'avatar']),
) {}

@ObjectType()
export class UpdateUserOutput extends CoreOutput {}
