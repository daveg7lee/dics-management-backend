import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.dto';
import { UsersService } from './users.service';

const ENCRYPTED_PASSWORD = 'encryptedPassword';

jest.mock('bcrypt', () => {
  return {
    hash: jest.fn(() => ENCRYPTED_PASSWORD),
    compare: jest.fn(),
  };
});

const createAccountArgs: CreateUserInput = {
  username: 'test',
  email: 'bs@email.com',
  password: 'bs.password',
  type: 'Student',
  grade: 'G12',
};

const mockPrismaClient = () => ({
  user: {
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

type MockPrismaClient = Partial<
  Record<
    keyof PrismaService,
    {
      create: jest.Mock;
      delete: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    }
  >
>;

describe('UsersService', () => {
  let service: UsersService;
  let prisma: MockPrismaClient;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        { provide: PrismaService, useValue: mockPrismaClient() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'jfkldsajfioew',
        email: 'daveg7lee@gmail.com',
      });

      const result = await service.create(createAccountArgs);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: createAccountArgs.username },
      });

      expect(result).toEqual({
        success: false,
        error: '이미 같은 이름의 유저가 존재합니다',
      });
    });

    it('should create a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(undefined);
      prisma.user.create.mockResolvedValue(createAccountArgs);

      const result = await service.create(createAccountArgs);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...createAccountArgs, password: ENCRYPTED_PASSWORD },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(createAccountArgs.password, 10);

      expect(result).toEqual({
        success: true,
        user: createAccountArgs,
      });
    });

    it('should fail on exception', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error());

      const result = await service.create(createAccountArgs);

      expect(result).toEqual({
        success: false,
        error: "Couldn't create account",
      });
    });
  });

  describe('login', () => {
    const loginArgs: LoginInput = {
      username: 'test',
      password: 'bs.password',
    };

    it('should fail if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(undefined);

      const result = await service.login(loginArgs);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: loginArgs.username },
        select: { id: true, password: true },
      });

      expect(result).toEqual({
        success: false,
        error: '유저를 찾을 수 없습니다',
      });
    });

    it('should fail if the password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'id',
        password: loginArgs.password,
      });
      bcrypt.compare.mockResolvedValue(false);

      const result = await service.login(loginArgs);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: loginArgs.username },
        select: { id: true, password: true },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginArgs.password,
        loginArgs.password,
      );

      expect(result).toEqual({
        success: false,
        error: 'Wrong password',
      });
    });

    it('should return token if password correct', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'id',
        password: loginArgs.password,
      });
      bcrypt.compare.mockResolvedValue(true);

      await service.login(loginArgs);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: loginArgs.username },
        select: { id: true, password: true },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginArgs.password,
        loginArgs.password,
      );

      expect(jwtService.sign).toHaveBeenCalledWith('id');
    });

    it('should fail on exception', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error());

      const result = await service.login(loginArgs);

      expect(result).toEqual({ success: false, error: "Can't log user in." });
    });
  });

  describe('findAll', () => {
    it('should return all users without admin', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 'id', ...createAccountArgs, scores: [] },
      ]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          NOT: {
            type: 'Admin',
          },
        },
        orderBy: { username: 'asc' },
        include: { scores: true },
      });

      expect(result.users).toBeInstanceOf(Array);
    });
    it('should fail on exception', async () => {
      prisma.user.findMany.mockRejectedValue(new Error());

      const result = await service.findAll();

      expect(result).toEqual({ success: false, error: 'Error occured' });
    });
  });

  describe('findById', () => {
    it('should fail if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(undefined);

      const result = await service.findById('id');

      expect(result).toEqual({
        success: false,
        error: '유저를 찾을 수 없습니다.',
      });
    });
    it('should return one user', async () => {
      prisma.user.findUnique.mockResolvedValue(createAccountArgs);

      const result = await service.findById('id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'id' },
      });

      expect(result).toEqual({ success: true, user: createAccountArgs });
    });
    it('should fail on exception', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error());

      const result = await service.findById('id');

      expect(result).toEqual({ success: false, error: 'Error occured' });
    });
  });

  describe('search', () => {
    it('should search user by username', async () => {
      prisma.user.findMany.mockResolvedValue([createAccountArgs]);

      const result = await service.search('username');

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { username: { startsWith: 'username' } },
      });

      expect(result).toEqual({ success: true, users: [createAccountArgs] });
    });

    it('should return empty array when receive empty string', async () => {
      const result = await service.search('');

      expect(result).toEqual({ success: true, users: [] });
    });

    it('should fail on exception', async () => {
      prisma.user.findMany.mockRejectedValue(new Error());

      const result = await service.search('username');

      expect(result).toEqual({ success: false, error: 'Error occured' });
    });
  });

  describe('update', () => {
    const mockedUser = {
      id: 'id',
      ...createAccountArgs,
      avatar: 'oldAvatar',
      createdAt: new Date('2022-12-16'),
    };

    it('should update user information', async () => {
      bcrypt.compare.mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(createAccountArgs);

      const result = await service.update(mockedUser, {
        email: createAccountArgs.email,
        oldPassword: createAccountArgs.password,
        newPassword: 'newPassword',
        avatar: 'avatar',
        grade: createAccountArgs.grade,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        createAccountArgs.password,
        createAccountArgs.password,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'id' },
        data: {
          email: createAccountArgs.email,
          avatar: 'avatar',
          password: ENCRYPTED_PASSWORD,
          grade: createAccountArgs.grade,
        },
      });

      expect(result).toEqual({
        success: true,
        user: createAccountArgs,
      });
    });

    it('should fail if the password is wrong', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const result = await service.update(mockedUser, {
        email: createAccountArgs.email,
        oldPassword: 'wrongPassword',
        newPassword: 'newPassword',
        avatar: 'avatar',
        grade: createAccountArgs.grade,
      });

      expect(result).toEqual({
        success: false,
        error: 'Wrong Password!',
      });
    });

    it('should fail on exception', async () => {
      bcrypt.compare.mockRejectedValue(new Error());

      const result = await service.update(mockedUser, {
        email: createAccountArgs.email,
        oldPassword: createAccountArgs.password,
        newPassword: 'newPassword',
        avatar: 'avatar',
        grade: createAccountArgs.grade,
      });

      expect(result).toEqual({ success: false, error: 'Error occured' });
    });
  });

  describe('remove', () => {
    it('should remove a user by username', async () => {
      prisma.user.findUnique.mockResolvedValue(createAccountArgs);

      const result = await service.remove(createAccountArgs.username);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: createAccountArgs.username },
      });

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { username: createAccountArgs.username },
      });

      expect(result).toEqual({ success: true });
    });

    it('should fail when user does not exists', async () => {
      prisma.user.findUnique.mockResolvedValue(undefined);

      const result = await service.remove(createAccountArgs.username);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: createAccountArgs.username },
      });

      expect(result).toEqual({
        success: false,
        error: '존재하지 않는 유저입니다.',
      });
    });

    it('should fail on exception', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error());

      const result = await service.remove(createAccountArgs.username);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: createAccountArgs.username },
      });

      expect(result).toEqual({ success: false, error: 'Error occured' });
    });
  });

  describe('graduate', () => {
    const mockedUser = {
      id: 'id',
      ...createAccountArgs,
      avatar: 'oldAvatar',
      createdAt: new Date('2022-12-16'),
    };
    it('should change grade of all students', async () => {
      prisma.user.findMany.mockResolvedValue([
        { ...mockedUser, grade: 'G12', id: 'G12ID' },
        { ...mockedUser, grade: 'G11', id: 'G11ID' },
        { ...mockedUser, grade: 'G10', id: 'G10ID' },
        { ...mockedUser, grade: 'G9', id: 'G9ID' },
        { ...mockedUser, grade: 'G8', id: "id: 'G8ID'" },
        { ...mockedUser, grade: 'G7', id: "id: 'G7ID'" },
        { ...mockedUser, grade: 'G6', id: 'G6ID' },
      ]);

      const result = await service.graduate();

      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'G12ID' },
      });

      expect(prisma.user.update).toHaveBeenCalledTimes(6);

      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      prisma.user.findMany.mockRejectedValue(new Error());

      const result = await service.graduate();

      expect(result).toEqual({ success: false, error: 'Error occured' });
    });
  });
});
