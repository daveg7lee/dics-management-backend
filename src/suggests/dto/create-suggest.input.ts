import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Suggest } from '../entities/suggest.entity';

@InputType()
export class CreateSuggestInput extends PickType(Suggest, ['text', 'type']) {}

@ObjectType()
export class SuggestOutput extends CoreOutput {
  @Field(() => Suggest, { nullable: true })
  suggest?: Suggest;
}
