import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { UsersService } from '../users/users.service';
import { SuggestsService } from './suggests.service';

const createAccountArgs: CreateUserInput = {
  username: 'test',
  email: 'bs@email.com',
  password: 'bs.password',
  type: 'Student',
  grade: 'G12',
};

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

const mockPrismaClient = () => ({
  suggest: {
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
});

describe('SuggestsService', () => {
  let service: SuggestsService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuggestsService,
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: PrismaService,
          useValue: mockPrismaClient(),
        },
      ],
    }).compile();

    service = module.get<SuggestsService>(SuggestsService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it.todo('should create a suggest');

    it.todo('1주 내에 제출된 건의가 있다면 실패');
  });

  describe('findAll', () => {
    it.todo('should return all waiting suggest');
  });
});
