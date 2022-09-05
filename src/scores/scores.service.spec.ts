import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../jwt/jwt.service';
import prisma from '../prisma';
import { UsersService } from '../users/users.service';
import { CreateScoreInput } from './dto/create-score.input';
import { ScoresService } from './scores.service';

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

const createScoreArgs: CreateScoreInput = {
  score: 3,
  article: 'test article',
  type: 'Merit',
  date: new Date().toISOString(),
  uploader: '이기현',
  username: 'testuser',
};

describe('ScoresService', () => {
  let service: ScoresService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        UsersService,
        { provide: JwtService, useValue: mockJwtService() },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.score.deleteMany();
  });

  describe('create', () => {
    it('should create a score', async () => {
      await userService.create({
        username: 'testuser',
        password: '1234',
        type: 'Student',
        grade: 'G10',
        email: '',
      });

      const result = await service.create(createScoreArgs);

      expect(result.success).toBeTruthy();
      expect(result.score.score).toEqual(3);
      expect(result.score.type).toEqual('Merit');
    });

    it('should fail when there is no user', async () => {
      const result = await service.create(createScoreArgs);

      expect(result.success).toBeFalsy();
      expect(result.error).toEqual('존재하지 않는 학생입니다.');
    });
  });

  describe('createByGrade', () => {
    it('should create score to grade', async () => {
      await userService.create({
        username: 'testuser1',
        password: 'password',
        type: 'Student',
        email: 'testuser1@gmail.com',
        grade: 'G11',
      });

      await userService.create({
        username: 'testuser2',
        password: 'password',
        type: 'Student',
        email: 'testuser2@gmail.com',
        grade: 'G11',
      });

      const result = await service.createByGrade({
        score: 1,
        article: 'demerit to grade',
        type: 'Merit',
        date: new Date().toISOString(),
        uploader: '이기현',
        grade: 'G11',
      });

      expect(result.success).toBeTruthy();

      const users = await userService.findAll();

      users.users.map((user) => {
        expect(user.scores[0].score).toEqual(1);
        expect(user.scores[0].type).toEqual('Merit');
        expect(user.scores[0].uploader).toEqual('이기현');
      });
    });
  });

  describe('remove', () => {
    it('should remove a score', async () => {
      await userService.create({
        username: 'testuser',
        password: '1234',
        type: 'Student',
        grade: 'G10',
        email: '',
      });

      const scoreResult = await service.create(createScoreArgs);

      const result = await service.remove(scoreResult.score.id);

      expect(result.success).toBeTruthy();
    });
  });

  describe('search', () => {
    it('should return a scores by term', async () => {
      await userService.create({
        username: 'testuser',
        password: '1234',
        type: 'Student',
        grade: 'G10',
        email: '',
      });

      await service.create(createScoreArgs);

      const result = await service.search(createScoreArgs.uploader);

      expect(result.success).toBeTruthy();
      expect(result.scores[0].article).toEqual(createScoreArgs.article);
    });
  });
});
