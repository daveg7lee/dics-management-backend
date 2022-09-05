import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../jwt/jwt.service';
import prisma from '../prisma';
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
      ],
    }).compile();

    service = module.get<SuggestsService>(SuggestsService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('create', () => {
    it('should create a suggest', async () => {
      const userResult = await userService.create(createAccountArgs);

      const result = await service.create(
        {
          text: 'test',
          title: 'test suggest',
          type: 'School',
        },
        userResult.user,
      );

      expect(result.success).toBeTruthy();
    });

    it('1주 내에 제출된 건의가 있다면 실패', async () => {
      const userResult = await userService.create(createAccountArgs);

      await service.create(
        {
          text: 'test',
          title: 'test suggest',
          type: 'School',
        },
        userResult.user,
      );

      const result = await service.create(
        {
          text: 'test',
          title: 'test suggest',
          type: 'School',
        },
        userResult.user,
      );

      expect(result.success).toBeFalsy();
      expect(result.error).toEqual('1주 내에 제출된 건의가 이미 존재합니다.');
    });
  });

  describe('findAll', () => {
    it('should return all waiting suggest', async () => {
      const userResult = await userService.create(createAccountArgs);

      await service.create(
        {
          text: 'test',
          title: 'test suggest',
          type: 'School',
        },
        userResult.user,
      );

      const result = await service.findAll('waiting');

      expect(result.success).toBeTruthy();
      expect(result.suggests[0].text).toEqual('test');
    });
  });
});
