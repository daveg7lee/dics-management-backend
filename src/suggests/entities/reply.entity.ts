import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { Suggest } from './suggest.entity';

@InputType('ReplyInputType', { isAbstract: true })
@ObjectType()
export class Reply extends CoreEntity {
  @Field(() => String)
  text: string;

  @Field(() => String)
  suggestId: string;

  @Field(() => Suggest, { nullable: true })
  suggest?: Suggest;
}
