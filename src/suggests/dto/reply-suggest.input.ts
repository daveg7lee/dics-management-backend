import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Suggest } from '../entities/suggest.entity';

@InputType()
export class ReplySuggestInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;
}

@ObjectType()
export class ReplySuggestOutput extends CoreOutput {
  @Field(() => Suggest, { nullable: true })
  suggest?: Suggest;
}
