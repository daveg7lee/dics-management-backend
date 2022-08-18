import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../jwt/jwt.service';
import prisma from '../prisma';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.dto';
import { UsersService } from './users.service';

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs: CreateUserInput = {
      username: 'test',
      email: 'bs@email.com',
      password: 'bs.password',
      type: 'Student',
    };

    it('should fail if user exists', async () => {
      await service.create(createAccountArgs);
      const result = await service.create(createAccountArgs);
      expect(result).toMatchObject({
        success: false,
        error: '이미 같은 이름의 유저가 존재합니다',
      });
    });

    it('should create a new user', async () => {
      const result = await service.create(createAccountArgs);

      expect(result.success).toBe(true);
    });
  });

  describe('login', () => {
    const loginArgs: LoginInput = {
      username: 'test',
      password: 'bs.password',
    };

    it('should fail if user does not exist', async () => {
      const result = await service.login(loginArgs);

      expect(result).toMatchObject({
        success: false,
        error: '유저를 찾을 수 없습니다',
      });
    });

    it('should fail if the password is wrong', async () => {
      await service.create({
        username: 'test',
        password: 'wrongpassword',
        type: 'Student',
        email: 'test@gmail.com',
      });

      const result = await service.login(loginArgs);

      expect(result).toMatchObject({ success: false, error: 'Wrong password' });
    });

    it('should return token if password correct', async () => {
      await service.create({
        username: 'test',
        password: 'bs.password',
        type: 'Student',
        email: 'test@gmail.com',
      });

      const result = await service.login(loginArgs);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });
  });
});
