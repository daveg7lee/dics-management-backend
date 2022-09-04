import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../jwt/jwt.service';
import prisma from '../prisma';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.dto';
import { UsersService } from './users.service';

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

describe('UsersService', () => {
  let service: UsersService;

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
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
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
      const wrongPasswordAccountArgs = {
        ...createAccountArgs,
        password: 'Wrong Password',
      };
      await service.create(wrongPasswordAccountArgs);

      const result = await service.login(loginArgs);

      expect(result).toMatchObject({ success: false, error: 'Wrong password' });
    });

    it('should return token if password correct', async () => {
      await service.create(createAccountArgs);

      const result = await service.login(loginArgs);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all users without admin', async () => {
      await service.create(createAccountArgs);

      const result = await service.findAll();

      expect(result.success).toBeTruthy();
      expect(result.users).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return one user', async () => {
      const user = await service.create(createAccountArgs);

      const result = await service.findById(user.user.id);

      expect(result.success).toBeTruthy();
      expect(result.user.email).toBe(createAccountArgs.email);
    });
  });

  describe('search', () => {
    it('should search user by username', async () => {
      const user = await service.create(createAccountArgs);

      const result = await service.search('te');

      expect(result.success).toBeTruthy();
      expect(result.users).toEqual(expect.arrayContaining([user.user]));
    });

    it('should return empty array when receive empty string', async () => {
      const result = await service.search('');

      expect(result.success).toBeTruthy();
      expect(result.users).toHaveLength(0);
    });
  });

  describe('update', () => {
    it("should update user's information", async () => {
      const user = await service.create(createAccountArgs);

      const result = await service.update(user.user, {
        email: 'update@gmail.com',
        oldPassword: createAccountArgs.password,
        newPassword: 'newPassword',
        grade: 'G10',
      });

      expect(result.success).toBeTruthy();
      expect(result.user.email).toEqual('update@gmail.com');
      expect(result.user.grade).toEqual('G10');
    });

    it('should fail if the password is wrong', async () => {
      const user = await service.create(createAccountArgs);

      const result = await service.update(user.user, {
        email: 'update@gmail.com',
        oldPassword: '#!%!#$%%^@$#%$@',
        newPassword: 'newPassword',
        grade: 'G10',
      });

      expect(result.success).toBeFalsy();
      expect(result.error).toEqual('Wrong Password!');
    });
  });

  describe('remove', () => {
    it('should remove a user by username', async () => {
      const user = await service.create(createAccountArgs);

      const result = await service.remove(createAccountArgs.username);

      expect(result.success).toBeTruthy();

      const findUserResult = await service.findById(user.user.id);

      expect(findUserResult.success).toBeFalsy();
      expect(findUserResult.error).toEqual('유저를 찾을 수 없습니다.');
    });

    it('should fail when user does not exists', async () => {
      const result = await service.remove(createAccountArgs.username);

      expect(result.success).toBeFalsy();
      expect(result.error).toEqual('존재하지 않는 유저입니다.');
    });
  });

  describe('graduate', () => {
    it('should graduate all students', async () => {
      await service.create(createAccountArgs);
      await service.create({
        username: 'test2',
        email: 'bs2@email.com',
        password: 'bs.password',
        type: 'Student',
        grade: 'G11',
      });
      const user1 = await service.create({
        username: 'test3',
        email: 'bs3@email.com',
        password: 'bs.password',
        type: 'Student',
        grade: 'G11',
      });
      const user2 = await service.create({
        username: 'test4',
        email: 'bs4@email.com',
        password: 'bs.password',
        type: 'Student',
        grade: 'G10',
      });
      const user3 = await service.create({
        username: 'test1',
        email: 'bs1@email.com',
        password: 'bs.password',
        type: 'Student',
        grade: 'G12',
      });

      const result = await service.graduate();

      expect(result.success).toBeTruthy();

      const findResult1 = await service.findById(user1.user.id);
      const findResult2 = await service.findById(user2.user.id);
      const findResult3 = await service.findById(user3.user.id);

      expect(findResult1.success).toBeTruthy();
      expect(findResult1.user.grade).toEqual('G12');
      expect(findResult2.success).toBeTruthy();
      expect(findResult2.user.grade).toEqual('G11');
      expect(findResult3.success).toBeFalsy();
    });
  });
});
