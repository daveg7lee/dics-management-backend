import {
  ObjectType,
  Field,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import { CoreEntity } from '../../common/entities/core.entity';
import { Score } from '../../scores/entities/score.entity';

registerEnumType(UserType, { name: 'UserType' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Field(() => String)
  avatar: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => UserType)
  type: UserType;

  @Field(() => [Score], { nullable: true })
  scores?: Score[];
}
