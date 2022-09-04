import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CoreOutput } from '../common/dtos/output.dto';
import { checkPassword } from '../common/utils';
import { JwtService } from '../jwt/jwt.service';
import prisma from '../prisma';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.input';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.input';
import { UserProfileOutput } from './dto/user-profile.dto';
import { UsersProfileOutput } from './dto/users-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async create({
    username,
    password,
    type,
    email,
    grade,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exists = await prisma.user.findUnique({ where: { username } });

      if (exists) {
        return { success: false, error: '이미 같은 이름의 유저가 존재합니다' };
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: encryptedPassword,
          type,
          grade,
        },
      });

      return { success: true, user };
    } catch (e) {
      console.log(e);
      return { success: false, error: e.message };
    }
  }

  async login({ username, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, password: true },
      });

      if (!user) {
        throw new Error('유저를 찾을 수 없습니다');
      }

      const passwordCorrect = await checkPassword(password, user);

      if (!passwordCorrect) {
        return {
          success: false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign(user.id);

      return {
        success: true,
        token,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async findAll(): Promise<UsersProfileOutput> {
    try {
      const users = await prisma.user.findMany({
        where: {
          NOT: {
            type: 'Admin',
          },
        },
        orderBy: { username: 'asc' },
      });

      return { success: true, users };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async findById(id: string): Promise<UserProfileOutput> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new Error('유저를 찾을 수 없습니다.');
      }

      return { success: true, user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async search(username: string): Promise<UsersProfileOutput> {
    try {
      if (username === '') {
        return { success: true, users: [] };
      }

      const users = await prisma.user.findMany({
        where: { username: { startsWith: username } },
      });

      return { success: true, users };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async update(
    authUser: User,
    { email, oldPassword, newPassword, avatar, grade }: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      let password;

      if (oldPassword) {
        const ok = await checkPassword(oldPassword, authUser);

        if (!ok) {
          throw new Error('Wrong Password!');
        } else {
          password = await bcrypt.hash(newPassword, 10);
        }
      }

      const user = await prisma.user.update({
        where: { id: authUser.id },
        data: {
          ...(email && { email }),
          ...(avatar && { avatar }),
          ...(password && { password }),
          ...(grade && { grade }),
        },
      });

      return {
        success: true,
        user,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async remove(username: string): Promise<CoreOutput> {
    try {
      const userExists = await prisma.user.findUnique({ where: { username } });
      if (!userExists) {
        return { success: false, error: '존재하지 않는 유저입니다.' };
      }

      await prisma.user.delete({ where: { username } });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async graduate(): Promise<CoreOutput> {
    try {
      const users = await prisma.user.findMany();

      await Promise.all(
        users.map(async (user) => {
          if (user.grade === 'G12') {
            await prisma.user.delete({ where: { id: user.id } });
          } else {
            if (user.grade === 'G6') {
              await prisma.user.update({
                where: { id: user.id },
                data: { grade: 'G7' },
              });
            } else if (user.grade === 'G7') {
              await prisma.user.update({
                where: { id: user.id },
                data: { grade: 'G8' },
              });
            } else if (user.grade === 'G8') {
              await prisma.user.update({
                where: { id: user.id },
                data: { grade: 'G9' },
              });
            } else if (user.grade === 'G9') {
              await prisma.user.update({
                where: { id: user.id },
                data: { grade: 'G10' },
              });
            } else if (user.grade === 'G10') {
              await prisma.user.update({
                where: { id: user.id },
                data: { grade: 'G11' },
              });
            } else if (user.grade === 'G11') {
              await prisma.user.update({
                where: { id: user.id },
                data: { grade: 'G12' },
              });
            }
          }
        }),
      );

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
