import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.entity';
import {
  CreatePhotoInput,
  PhotoOutput,
  PhotosOutput,
} from './dto/create-photo.input';
import { CoreOutput } from '../common/dtos/output.dto';

@Resolver(() => Photo)
export class PhotosResolver {
  constructor(private readonly photosService: PhotosService) {}

  @Mutation(() => PhotoOutput)
  createPhoto(@Args('createPhotoInput') createPhotoInput: CreatePhotoInput) {
    return this.photosService.create(createPhotoInput);
  }

  @Query(() => PhotosOutput, { name: 'photos' })
  findAll(@Args('cursor', { type: () => String }) cursor: string) {
    return this.photosService.findAll(cursor);
  }

  @Query(() => PhotoOutput, { name: 'photo' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.photosService.findOne(id);
  }

  @Mutation(() => CoreOutput)
  removePhoto(@Args('id', { type: () => String }) id: string) {
    return this.photosService.remove(id);
  }
}
