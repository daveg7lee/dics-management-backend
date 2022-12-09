import {
  ObjectType,
  Field,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import { GradeType, UserType } from '@prisma/client';
import { Reply } from 'src/suggests/entities/reply.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Score } from '../../scores/entities/score.entity';
import { Suggest } from '../../suggests/entities/suggest.entity';

registerEnumType(UserType, { name: 'UserType' });
registerEnumType(GradeType, { name: 'GradeType' });

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

  @Field(() => GradeType)
  grade: GradeType;

  @Field(() => [Score], { nullable: true })
  scores?: Score[];

  @Field(() => [Reply], { nullable: true })
  replies?: Reply[];

  @Field(() => [Suggest], { nullable: true })
  suggests?: Suggest[];
}
