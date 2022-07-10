import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Score } from '../entities/score.entity';

@ObjectType()
export class ScoresOutput extends CoreOutput {
  @Field(() => [Score], { nullable: true })
  scores?: Score[];
}
