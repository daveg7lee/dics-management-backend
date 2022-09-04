import { CreateSuggestInput } from './create-suggest.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSuggestInput extends PartialType(CreateSuggestInput) {
  @Field(() => String)
  id: string;
}
