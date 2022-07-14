import { Injectable } from '@nestjs/common';
import prisma from '../prisma';
import { CreateScoreInput, ScoreOutput } from './dto/create-score.input';
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
  }: CreateScoreInput): Promise<ScoreOutput> {
    try {
      const createdScore = await prisma.score.create({
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

      return { success: true, score: createdScore };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async remove(id: string): Promise<ScoreOutput> {
    try {
      const score = await prisma.score.delete({ where: { id } });

      return { success: true, score };
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
