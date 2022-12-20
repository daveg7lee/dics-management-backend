import { Injectable } from '@nestjs/common';
import { SuggestStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoreOutput } from '../common/dtos/output.dto';
import { User } from '../users/entities/user.entity';
import { CreateSuggestInput, SuggestOutput } from './dto/create-suggest.input';
import { ReplySuggestOutput } from './dto/reply-suggest.input';
import { SuggestsOutput } from './dto/suggests.dto';
import {
  UpdateSuggestInput,
  UpdateSuggestOutput,
} from './dto/update-suggest.input';

@Injectable()
export class SuggestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { text, type, title }: CreateSuggestInput,
    user: User,
  ): Promise<CoreOutput> {
    try {
      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      const aWeekAgo = new Date(year, month, day - 7);

      const createdSuggestInWeek = await this.prisma.suggest.findFirst({
        where: {
          userId: user.id,
          createdAt: { gte: aWeekAgo, lte: today },
        },
      });

      if (createdSuggestInWeek) {
        throw new Error('1주 내에 제출된 건의가 이미 존재합니다.');
      }

      await this.prisma.suggest.create({
        data: {
          title,
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

  async findAll(status: SuggestStatus): Promise<SuggestsOutput> {
    try {
      const suggests = await this.prisma.suggest.findMany({
        where: { status },
        include: { user: true, reply: { include: { user: true } } },
      });

      return { success: true, suggests };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async findOne(id: string): Promise<SuggestOutput> {
    try {
      const isSuggestExists = await this.prisma.suggest.findUnique({
        where: { id },
      });

      if (!isSuggestExists) {
        throw new Error('건의를 찾을 수 없습니다');
      }

      return { success: true, suggest: isSuggestExists };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async findMy(user: User): Promise<SuggestsOutput> {
    try {
      const suggests = await this.prisma.suggest.findMany({
        where: { userId: user.id },
        include: { user: true, reply: { include: { user: true } } },
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
    { status }: UpdateSuggestInput,
  ): Promise<UpdateSuggestOutput> {
    try {
      const isSuggestExists = await this.prisma.suggest.findUnique({
        where: { id },
      });

      if (!isSuggestExists) {
        throw new Error('건의를 찾을 수 없습니다.');
      }

      const suggest = await this.prisma.suggest.update({
        where: { id },
        data: { status },
        include: { user: true, reply: { include: { user: true } } },
      });

      return { success: true, suggest };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async remove(id: string): Promise<CoreOutput> {
    try {
      const isSuggestExists = await this.prisma.suggest.findUnique({
        where: { id },
      });

      if (!isSuggestExists) {
        throw new Error('건의를 찾을 수 없습니다');
      }

      await this.prisma.suggest.delete({ where: { id } });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async replyTo(
    id: string,
    text: string,
    user: User,
  ): Promise<ReplySuggestOutput> {
    try {
      const isSuggestExists = await this.prisma.suggest.findUnique({
        where: { id },
      });

      if (!isSuggestExists) {
        throw new Error('건의를 찾을 수 없습니다');
      }

      await this.prisma.reply.create({
        data: {
          text,
          suggest: { connect: { id } },
          user: { connect: { id: user.id } },
        },
      });

      const suggest = await this.prisma.suggest.findUnique({
        where: { id },
        include: { user: true, reply: { include: { user: true } } },
      });

      return { success: true, suggest };
    } catch (e) {
      return {
        success: true,
        error: e.message,
      };
    }
  }
}
