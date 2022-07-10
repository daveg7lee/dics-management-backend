import { Resolver, Mutation, Args, Query, ResolveField } from '@nestjs/graphql';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';
import { CreateScoreInput, CreateScoreOutput } from './dto/create-score.input';
import { CoreOutput } from '../common/dtos/output.dto';
import { Role } from '../auth/role.decorator';
import { ScoresOutput } from './dto/scores.dto';
import { User } from '../users/entities/user.entity';
import prisma from '../prisma';

@Resolver(() => Score)
export class ScoresResolver {
  constructor(private readonly scoresService: ScoresService) {}

  @Mutation(() => CreateScoreOutput)
  @Role(['Admin'])
  createScore(
    @Args('createScoreInput') createScoreInput: CreateScoreInput,
  ): Promise<CreateScoreOutput> {
    return this.scoresService.create(createScoreInput);
  }

  @Query(() => ScoresOutput)
  @Role(['Admin'])
  searchScore(@Args('term', { type: () => String }) term: string) {
    return this.scoresService.search(term);
  }

  @Mutation(() => CoreOutput)
  @Role(['Admin'])
  deleteScore(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CoreOutput> {
    return this.scoresService.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  async user({ id }) {
    return prisma.score.findUnique({ where: { id } }).user();
  }
}
