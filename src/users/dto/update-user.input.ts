import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'grade']),
) {
  @Field(() => String, { nullable: true })
  oldPassword?: string;

  @Field(() => String, { nullable: true })
  newPassword?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}

@ObjectType()
export class UpdateUserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
