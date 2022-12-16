import { Module } from '@nestjs/common';
import { SuggestsService } from './suggests.service';
import { SuggestsResolver } from './suggests.resolver';

@Module({
  providers: [SuggestsResolver, SuggestsService],
})
export class SuggestsModule {}
