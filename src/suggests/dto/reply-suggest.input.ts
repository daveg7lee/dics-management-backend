import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ReplySuggestInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;
}
