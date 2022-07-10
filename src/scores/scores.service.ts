import { Injectable } from '@nestjs/common';
import { CoreOutput } from '../common/dtos/output.dto';
import prisma from '../prisma';
import { CreateScoreInput, CreateScoreOutput } from './dto/create-score.input';
import { ScoresOutput } from './dto/scores.dto';

@Injectable()
export class ScoresService {
  async create({
    score,
    article,
    type,
    date,
    uploader,
    detail,
    username,
  }: CreateScoreInput): Promise<CreateScoreOutput> {
    try {
      await prisma.score.create({
        data: {
          score,
          article,
          type,
          user: { connect: { username } },
          date,
          uploader,
          detail,
        },
      });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async remove(id: string): Promise<CoreOutput> {
    try {
      await prisma.score.delete({ where: { id } });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async search(term: string): Promise<ScoresOutput> {
    try {
      const scores = await prisma.score.findMany({
        where: { uploader: { startsWith: term } },
        include: { user: true },
      });

      return {
        success: true,
        scores,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
