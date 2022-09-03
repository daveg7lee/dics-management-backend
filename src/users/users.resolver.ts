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
import prisma from '../prisma';
import { UsersProfileOutput } from './dto/users-profile.dto';
import { Auth } from '../auth/auth.decorator';
import { CoreOutput } from '../common/dtos/output.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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

  @Mutation(() => UpdateUserOutput)
  @Auth(['Admin'])
  removeUser(
    @Args('username', { type: () => String }) username: string,
  ): Promise<UpdateUserOutput> {
    return this.usersService.remove(username);
  }

  @ResolveField(() => Int, { nullable: true })
  async totalScores({ id }) {
    const scores = await prisma.score.findMany({
      where: { userId: id, type: 'Demerit' },
    });
    let total = 0;
    scores.map((score) => {
      total -= score.score;
    });
    return total;
  }

  @ResolveField(() => Int, { nullable: true })
  async scores({ id }) {
    return prisma.score.findMany({ where: { userId: id } });
  }

  @ResolveField(() => Int, { nullable: true })
  async totalMerit({ id }) {
    const scores = await prisma.score.findMany({
      where: { userId: id, type: 'Merit' },
    });

    let total = 0;
    scores.map((score) => {
      total += score.score;
    });
    return total;
  }
}
