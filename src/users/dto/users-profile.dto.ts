import { Field, ObjectType, ArgsType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class UsersProfileOutput extends CoreOutput {
  @Field(() => [User], { nullable: true })
  users?: User[];
}

@ArgsType()
export class UsersProfileInput {
  @Field(() => String, { nullable: true })
  id?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  username?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  createdAt?: 'asc' | 'desc';
}
