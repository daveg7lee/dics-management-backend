import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreEntity {
  @Field((type) => String)
  id: string;

  @Field((type) => Date)
  createdAt: Date;
}
