import { Injectable } from '@nestjs/common';
import { CoreOutput } from '../common/dtos/output.dto';
import prisma from '../prisma';
import { User } from '../users/entities/user.entity';
import { CreateSuggestInput } from './dto/create-suggest.input';
import { SuggestsOutput } from './dto/suggests.dto';
import { UpdateSuggestInput } from './dto/update-suggest.input';

@Injectable()
export class SuggestsService {
  async create(
    { text, type }: CreateSuggestInput,
    user: User,
  ): Promise<CoreOutput> {
    try {
      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      const aWeekAgo = new Date(year, month, day - 7);

      const createdSuggestInWeek = await prisma.suggest.findFirst({
        where: {
          userId: user.id,
          createdAt: { gte: aWeekAgo, lte: today },
        },
      });

      if (createdSuggestInWeek) {
        throw new Error('1주 내에 제출된 건의가 이미 존재합니다.');
      }

      await prisma.suggest.create({
        data: {
          text,
          type,
          status: 'waiting',
          user: { connect: { id: user.id } },
        },
      });

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async findAll(): Promise<SuggestsOutput> {
    try {
      const suggests = await prisma.suggest.findMany({
        include: { user: true },
      });

      return { success: true, suggests };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async findMy(user: User): Promise<SuggestsOutput> {
    try {
      const suggests = await prisma.suggest.findMany({
        where: { userId: user.id },
      });

      return {
        success: true,
        suggests,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async update(
    id: string,
    { text, type }: UpdateSuggestInput,
  ): Promise<CoreOutput> {
    try {
      const isSuggestExists = await prisma.suggest.findUnique({
        where: { id },
      });

      if (!isSuggestExists) {
        throw new Error('건의를 찾을 수 없습니다.');
      }

      await prisma.suggest.update({
        where: { id },
        data: { text, type },
      });

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async remove(id: string): Promise<CoreOutput> {
    try {
      const isSuggestExists = await prisma.suggest.findUnique({
        where: { id },
      });

      if (!isSuggestExists) {
        throw new Error('건의를 찾을 수 없습니다');
      }

      await prisma.suggest.delete({ where: { id } });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}