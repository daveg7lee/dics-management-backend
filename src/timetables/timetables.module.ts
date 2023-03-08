import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { TimetablesResolver } from './timetables.resolver';

@Module({
  providers: [TimetablesResolver, TimetablesService],
})
export class TimetablesModule {}
