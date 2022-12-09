import { InputType, Field, PickType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Suggest } from '../entities/suggest.entity';

@InputType()
export class UpdateSuggestInput extends PickType(Suggest, ['status']) {
  @Field(() => String)
  id: string;
}

@ObjectType()
export class UpdateSuggestOutput extends CoreOutput {
  @Field(() => Suggest, { nullable: true })
  suggest?: Suggest;
}
