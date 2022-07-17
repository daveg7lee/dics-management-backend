import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Score } from '../entities/score.entity';

@ObjectType()
export class ScoresOutput extends CoreOutput {
  @Field(() => [Score], { nullable: true })
  scores?: Score[];
}

@ArgsType()
export class ScoresInput {
  @Field(() => String, { nullable: true })
  id?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  score?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  date?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  createdAt?: 'asc' | 'desc';
}
