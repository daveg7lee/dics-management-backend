import { Injectable } from '@nestjs/common';
import { ScoreType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoreOutput } from '../common/dtos/output.dto';
import { CreateScoreInput, ScoreOutput } from './dto/create-score.input';
import { ScoresOutput } from './dto/scores.dto';

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

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
      const userExist = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!userExist) {
        return {
          success: false,
          error: '존재하지 않는 학생입니다.',
        };
      }

      const createdScore = await this.prisma.score.create({
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
      return { success: false, error: "Can't create score" };
    }
  }

  async createByGrade({
    score,
    article,
    type,
    date,
    uploader,
    detail,
    grade,
  }: CreateScoreInput): Promise<ScoreOutput> {
    try {
      const users = await this.prisma.user.findMany({ where: { grade } });

      await Promise.all(
        users.map(async (user) => {
          await this.prisma.score.create({
            data: {
              score,
              article,
              type,
              user: { connect: { username: user.username } },
              date,
              uploader,
              detail,
            },
            include: { user: true },
          });
        }),
      );

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: "Can't create score",
      };
    }
  }

  async remove(id: string): Promise<ScoreOutput> {
    try {
      const scoreExist = await this.prisma.score.findUnique({ where: { id } });

      if (!scoreExist) {
        return {
          success: false,
          error: '존재하지 않는 점수입니다',
        };
      }

      const score = await this.prisma.score.delete({ where: { id } });

      return { success: true, score };
    } catch (e) {
      return { success: false, error: "Can't remove score" };
    }
  }

  async removeByUser(username: string): Promise<CoreOutput> {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!userExist) {
        return {
          success: false,
          error: '존재하지 않는 학생입니다',
        };
      }

      await this.prisma.score.deleteMany({
        where: { userId: userExist.id, type: 'Demerit' },
      });

      return { success: true };
    } catch (e) {
      return { success: false, error: "Can't remove score" };
    }
  }

  async search(term: string): Promise<ScoresOutput> {
    try {
      const scores = await this.prisma.score.findMany({
        where: { uploader: { startsWith: term } },
        include: { user: true },
      });

      return {
        success: true,
        scores,
      };
    } catch (e) {
      return { success: false, error: "Can't find scores" };
    }
  }

  async reset(type: ScoreType): Promise<CoreOutput> {
    try {
      await this.prisma.score.deleteMany({ where: { type } });

      return { success: true };
    } catch (e) {
      return { success: false, error: "Can't reset the score" };
    }
  }
}
