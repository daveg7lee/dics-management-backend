import { Injectable } from '@nestjs/common';
import { GradeType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeTablesOutput } from './dto/timetable.input';

@Injectable()
export class TimetablesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(grade: GradeType): Promise<TimeTablesOutput> {
    try {
      const timetables = await this.prisma.timeTables.findMany({
        where: { grade },
        include: {
          timeTables: {
            orderBy: { startTime: 'asc' },
            include: { subject: true },
          },
        },
      });

      return { success: true, timetables };
    } catch (e) {
      return { success: false, error: 'Error occured' };
    }
  }
}
