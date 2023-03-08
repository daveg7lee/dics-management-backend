import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GradeType, TimeTable } from '@prisma/client';

enum DayType {
  MON,
  TUE,
  WED,
  THU,
  FRI,
}

@ObjectType()
export class Timetables {
  @Field(() => Int)
  id;

  @Field(() => String)
  title;

  @Field(() => GradeType)
  grade;

  @Field(() => String)
  day: DayType;

  @Field(() => [Timetable])
  timeTables;

  @Field(() => Date)
  createdAt;
}

@ObjectType()
export class Timetable {
  @Field(() => String)
  id;

  @Field(() => Subject)
  subject;

  @Field(() => String)
  subjectId;

  @Field(() => String)
  startTime;

  @Field(() => String)
  endTime;

  @Field(() => Timetables)
  TimeTables;

  @Field(() => String)
  TimeTablesId;

  @Field(() => Date)
  createdAt;
}

@ObjectType()
export class Subject {
  @Field(() => String)
  id;

  @Field(() => String)
  subject;

  @Field(() => [Timetable])
  TimeTable;

  @Field(() => Date)
  createdAt;
}
