import {
  ObjectType,
  Field,
  Int,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { ScoreType } from '@prisma/client';
import { CoreEntity } from '../../common/entities/core.entity';

registerEnumType(ScoreType, { name: 'ScoreType' });

@InputType('ScoreInputType', { isAbstract: true })
@ObjectType()
export class Score extends CoreEntity {
  @Field(() => Int)
  score: number;

  @Field(() => String)
  article: string;

  @Field(() => String)
  userId: string;

  @Field(() => ScoreType)
  type: ScoreType;

  @Field(() => String)
  date: string;

  @Field(() => String)
  uploader: string;

  @Field(() => String, { nullable: true })
  detail?: string;
}
