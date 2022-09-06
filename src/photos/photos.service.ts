import { Injectable } from '@nestjs/common';
import { CoreOutput } from '../common/dtos/output.dto';
import prisma from '../prisma';
import {
  CreatePhotoInput,
  PhotoOutput,
  PhotosOutput,
} from './dto/create-photo.input';

@Injectable()
export class PhotosService {
  async create({ files, caption }: CreatePhotoInput): Promise<PhotoOutput> {
    try {
      const photo = await prisma.photo.create({ data: { files, caption } });

      return { success: true, photo };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async findAll(cursor: string): Promise<PhotosOutput> {
    try {
      const photos = await prisma.photo.findMany({
        take: 20,
        skip: cursor ? 1 : 0,
        ...(cursor && {
          cursor: {
            id: cursor,
          },
        }),
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, photos };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async findOne(id: string): Promise<PhotoOutput> {
    try {
      const photo = await prisma.photo.findUnique({ where: { id } });

      if (!photo) {
        throw new Error('사진을 찾을 수 없습니다.');
      }

      return { success: true, photo };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async remove(id: string): Promise<CoreOutput> {
    try {
      const photo = await prisma.photo.findUnique({ where: { id } });

      if (!photo) {
        throw new Error('사진을 찾을 수 없습니다.');
      }

      await prisma.photo.delete({ where: { id } });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
