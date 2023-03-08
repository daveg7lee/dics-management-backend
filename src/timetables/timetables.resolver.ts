import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TimetablesService } from './timetables.service';
import { Timetable } from './entities/timetable.entity';
import { TimeTablesInput, TimeTablesOutput } from './dto/timetable.input';

@Resolver(() => Timetable)
export class TimetablesResolver {
  constructor(private readonly timetablesService: TimetablesService) {}

  @Query(() => TimeTablesOutput, { name: 'timetable' })
  findOne(@Args() { grade }: TimeTablesInput) {
    return this.timetablesService.findOne(grade);
  }
}
