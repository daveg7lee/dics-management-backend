import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { GradeType, TimeTables } from '@prisma/client';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Timetables } from '../entities/timetable.entity';

@ArgsType()
export class TimeTablesInput {
  @Field((type) => GradeType)
  grade: GradeType;
}

@ObjectType()
export class TimeTablesOutput extends CoreOutput {
  @Field((type) => [Timetables])
  timetables?: TimeTables[];
}
