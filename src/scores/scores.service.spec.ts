import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../jwt/jwt.service';
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

  describe('create', () => {
    it.todo('should create a score');

    it.todo('should fail when there is no user');
  });

  describe('createByGrade', () => {
    it.todo('should create score to grade');
  });

  describe('remove', () => {
    it.todo('should remove a score');
  });

  describe('search', () => {
    it.todo('should return a scores by term');
  });
});
