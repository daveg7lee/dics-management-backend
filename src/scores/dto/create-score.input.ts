import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Score } from '../entities/score.entity';

@InputType()
export class CreateScoreInput extends PickType(Score, [
  'score',
  'article',
  'type',
  'date',
  'uploader',
  'detail',
]) {
  @Field(() => String)
  username: string;
}

@ObjectType()
export class ScoreOutput extends CoreOutput {
  @Field(() => Score, { nullable: true })
  score?: Score;
}
