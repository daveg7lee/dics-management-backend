import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScoreInput } from './dto/create-score.input';
import { ScoresService } from './scores.service';

const mockPrismaClient = () => ({
  score: {
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  user: {
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
});

const createScoreArgs: CreateScoreInput = {
  score: 3,
  article: 'test article',
  type: 'Merit',
  date: new Date().toISOString(),
  uploader: '이기현',
  username: 'testuser',
};

type MockPrismaClient = Partial<
  Record<
    keyof PrismaService,
    {
      create: jest.Mock;
      delete: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      deleteMany: jest.Mock;
    }
  >
>;

describe('ScoresService', () => {
  let service: ScoresService;
  let prisma: MockPrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        { provide: PrismaService, useValue: mockPrismaClient() },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should fail when user not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(undefined);

      const result = await service.create(createScoreArgs);

      expect(result).toEqual({
        success: false,
        error: '존재하지 않는 학생입니다.',
      });
    });

    it('should create a score', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'id' });
      prisma.score.create.mockResolvedValue(createScoreArgs);

      const result = await service.create(createScoreArgs);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: createScoreArgs.username },
      });

      expect(prisma.score.create).toHaveBeenCalledWith({
        data: {
          score: createScoreArgs.score,
          article: createScoreArgs.article,
          type: createScoreArgs.type,
          user: { connect: { username: createScoreArgs.username } },
          date: createScoreArgs.date,
          uploader: createScoreArgs.uploader,
          detail: createScoreArgs.detail,
        },
      });

      expect(result).toEqual({ success: true, score: createScoreArgs });
    });

    it('should fail on exception', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error());

      const result = await service.create(createScoreArgs);

      expect(result).toEqual({ success: false, error: "Can't create score" });
    });
  });

  describe('createByGrade', () => {
    it('should create score to grade', async () => {
      prisma.user.findMany.mockResolvedValue([
        { username: '이기현' },
        { username: '오윤' },
        { username: '이기원' },
        { username: '김민솔' },
      ]);

      const result = await service.createByGrade({
        ...createScoreArgs,
        grade: 'G12',
      });

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { grade: 'G12' },
      });

      expect(prisma.score.create).toHaveBeenCalledTimes(4);

      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      prisma.user.findMany.mockRejectedValue(new Error());

      const result = await service.createByGrade({
        ...createScoreArgs,
        grade: 'G12',
      });

      expect(result).toEqual({
        success: false,
        error: "Can't create score",
      });
    });
  });

  describe('remove', () => {
    it('should remove a score', async () => {
      prisma.score.findUnique.mockResolvedValue(createScoreArgs);
      prisma.score.delete.mockResolvedValue(createScoreArgs);

      const result = await service.remove('testId');

      expect(prisma.score.findUnique).toHaveBeenCalledWith({
        where: { id: 'testId' },
      });

      expect(prisma.score.delete).toHaveBeenCalledWith({
        where: { id: 'testId' },
      });

      expect(result).toEqual({ success: true, score: createScoreArgs });
    });

    it('should fail when score does not exist', async () => {
      prisma.score.findUnique.mockResolvedValue(undefined);

      const result = await service.remove('testId');

      expect(result).toEqual({
        success: false,
        error: '존재하지 않는 점수입니다',
      });
    });

    it('should fail on exception', async () => {
      prisma.score.findUnique.mockRejectedValue(new Error());

      const result = await service.remove('testId');

      expect(result).toEqual({ success: false, error: "Can't remove score" });
    });
  });

  describe('search', () => {
    it('should return a scores by term', async () => {
      prisma.score.findMany.mockResolvedValue([createScoreArgs]);

      const result = await service.search('term');

      expect(prisma.score.findMany).toHaveBeenCalledWith({
        where: { uploader: { startsWith: 'term' } },
        include: { user: true },
      });

      expect(result).toEqual({
        success: true,
        scores: [createScoreArgs],
      });
    });

    it('should fail on exception', async () => {
      prisma.score.findMany.mockRejectedValue(new Error());

      const result = await service.search('term');

      expect(result).toEqual({ success: false, error: "Can't find scores" });
    });
  });

  describe('reset', () => {
    it('should delete input type of scores', async () => {
      const result = await service.reset('Merit');

      expect(prisma.score.deleteMany).toHaveBeenCalledWith({
        where: { type: 'Merit' },
      });

      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      prisma.score.deleteMany.mockRejectedValue(new Error());

      const result = await service.reset('Demerit');

      expect(result).toEqual({
        success: false,
        error: "Can't reset the score",
      });
    });
  });
});
