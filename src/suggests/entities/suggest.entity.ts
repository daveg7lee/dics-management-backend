import {
  ObjectType,
  Field,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import { SuggestStatus, SuggestType } from '@prisma/client';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Reply } from './reply.entity';

registerEnumType(SuggestType, { name: 'SuggestType' });
registerEnumType(SuggestStatus, { name: 'SuggestStatus' });

@InputType('SuggestInputType', { isAbstract: true })
@ObjectType()
export class Suggest extends CoreEntity {
  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  @Field(() => String)
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => SuggestType)
  type: SuggestType;

  @Field(() => [Reply], { nullable: true })
  reply?: Reply[];

  @Field(() => SuggestStatus)
  status: SuggestStatus;
}
