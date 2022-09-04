import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Suggest } from '../entities/suggest.entity';

@ObjectType()
export class SuggestsOutput extends CoreOutput {
  @Field(() => [Suggest], { nullable: true })
  suggests?: Suggest[];
}
