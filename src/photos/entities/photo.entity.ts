import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';

@InputType('PhotoInputType', { isAbstract: true })
@ObjectType()
export class Photo extends CoreEntity {
  @Field(() => [String])
  files: string[];

  @Field(() => String)
  caption: string;
}
