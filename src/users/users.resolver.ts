import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserOutput, CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { AuthUser } from '../auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UsersProfileOutput } from './dto/users-profile.dto';
import { Auth } from '../auth/auth.decorator';
import { CoreOutput } from '../common/dtos/output.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => CreateUserOutput)
  @Auth(['Admin'])
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation(() => CoreOutput)
  async graduate(): Promise<CoreOutput> {
    return this.usersService.graduate();
  }

  @Query(() => User)
  @Auth(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(() => UserProfileOutput)
  @Auth(['Any'])
  findOne(@Args() userProfileInput: UserProfileInput) {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Query(() => UsersProfileOutput)
  searchUser(
    @Args('username', { type: () => String }) username: string,
  ): Promise<UsersProfileOutput> {
    return this.usersService.search(username);
  }

  @Query(() => UsersProfileOutput)
  seeUsers(): Promise<UsersProfileOutput> {
    return this.usersService.findAll();
  }

  @Mutation(() => UpdateUserOutput)
  updateUser(
    @AuthUser() authUser: User,
    @Args('input') updateUserInput: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    return this.usersService.update(authUser, updateUserInput);
  }

  @Mutation(() => CoreOutput)
  @Auth(['Admin'])
  removeUser(
    @Args('username', { type: () => String }) username: string,
  ): Promise<CoreOutput> {
    return this.usersService.remove(username);
  }

  @ResolveField(() => Int, { nullable: true })
  async totalScores({ id }) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const scores = await this.prisma.score.findMany({
      where: {
        userId: id,
        type: 'Demerit',
      },
    });

    let total = 0;
    scores.map((score) => {
      const year = score.date.split('-')[0];
      const month = score.date.split('-')[1];

      if (+year === currentYear && +month === currentMonth) {
        total -= score.score;
      }
    });
    return total;
  }

  @ResolveField(() => Int, { nullable: true })
  async scores({ id }) {
    const scores = await this.prisma.score.findMany({ where: { userId: id } });
    return scores;
  }

  @ResolveField(() => Int, { nullable: true })
  async totalMerit({ id }) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const scores = await this.prisma.score.findMany({
      where: { userId: id, type: 'Merit' },
    });

    let total = 0;
    scores.map((score) => {
      const year = score.date.split('-')[0];
      const month = score.date.split('-')[1];

      if (+year === currentYear && +month === currentMonth) {
        total += score.score;
      }
    });
    return total;
  }

  @ResolveField(() => Int, { nullable: true })
  async fullMerit({ id }) {
    const scores = await this.prisma.score.findMany({
      where: { userId: id, type: 'Merit' },
    });

    let total = 0;
    scores.map((score) => {
      total += score.score;
    });
    return total;
  }

  @ResolveField(() => Int, { nullable: true })
  async fullScores({ id }) {
    const scores = await this.prisma.score.findMany({
      where: { userId: id, type: 'Demerit' },
    });

    let total = 0;
    scores.map((score) => {
      total -= score.score;
    });
    return total;
  }

  @ResolveField(() => Boolean)
  async attendance({ fingerId }) {
    if (fingerId === null) return false;

    const today = new Date();

    const attendance = await this.prisma.attendance.findFirst({
      where: { fingerId, createdAt: { lte: today } },
      orderBy: { createdAt: 'desc' },
    });

    if (!attendance) return false;

    return !!attendance;
  }
}
