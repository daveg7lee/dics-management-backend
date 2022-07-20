import { Injectable } from '@nestjs/common';
import * as nodeoutlook from 'nodejs-nodemailer-outlook';
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
      const userExists = await prisma.user.findUnique({ where: { username } });

      if (!userExists) {
        throw new Error('존재하지 않는 학생입니다.');
      }

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

      if (userExists.email && type === 'Demerit') {
        await nodeoutlook.sendEmail({
          auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
          },
          from: process.env.MAIL_ADDRESS,
          to: userExists.email,
          subject: `벌점 ${score}점이 입력되었습니다.`,
          html: `<h1>다음과 같은 사유로 벌점 ${score}점이 입력되었습니다.</h1> <h2>${article}</h2>`,
          text: article,
          replyTo: 'dicscouncil@gmail.com',
        });
      }

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
