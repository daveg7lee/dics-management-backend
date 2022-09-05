import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Photo } from '../entities/photo.entity';

@InputType()
export class CreatePhotoInput extends PickType(Photo, ['files', 'caption']) {}

@ObjectType()
export class PhotoOutput extends CoreOutput {
  @Field(() => Photo, { nullable: true })
  photo?: Photo;
}

@ObjectType()
export class PhotosOutput extends CoreOutput {
  @Field(() => [Photo], { nullable: true })
  photos?: Photo[];
}
