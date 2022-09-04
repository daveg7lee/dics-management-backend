import { InputType, Field, PickType } from '@nestjs/graphql';
import { Suggest } from '../entities/suggest.entity';

@InputType()
export class UpdateSuggestInput extends PickType(Suggest, ['status']) {
  @Field(() => String)
  id: string;
}
