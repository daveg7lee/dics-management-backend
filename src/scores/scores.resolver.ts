import { Resolver, Mutation, Args, Query, ResolveField } from '@nestjs/graphql';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';
import { CreateScoreInput, ScoreOutput } from './dto/create-score.input';
import { CoreOutput } from '../common/dtos/output.dto';
import { ScoresOutput } from './dto/scores.dto';
import { User } from '../users/entities/user.entity';
import prisma from '../prisma';
import { ScoreType } from '@prisma/client';
import { Auth } from 'src/auth/auth.decorator';

@Resolver(() => Score)
export class ScoresResolver {
  constructor(private readonly scoresService: ScoresService) {}

  @Mutation(() => ScoreOutput)
  @Auth(['Admin'])
  createScore(
    @Args('createScoreInput') createScoreInput: CreateScoreInput,
  ): Promise<ScoreOutput> {
    return this.scoresService.create(createScoreInput);
  }

  @Mutation(() => ScoreOutput)
  @Auth(['Admin'])
  createScoreByGrade(
    @Args('createScoreInput') createScoreInput: CreateScoreInput,
  ): Promise<ScoreOutput> {
    return this.scoresService.createByGrade(createScoreInput);
  }

  @Mutation(() => CoreOutput)
  @Auth(['Admin'])
  resetScores(
    @Args('type', { type: () => ScoreType }) type: ScoreType,
  ): Promise<CoreOutput> {
    return this.scoresService.reset(type);
  }

  @Query(() => ScoresOutput)
  @Auth(['Admin'])
  searchScore(@Args('term', { type: () => String }) term: string) {
    return this.scoresService.search(term);
  }

  @Mutation(() => ScoreOutput)
  @Auth(['Admin'])
  deleteScore(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ScoreOutput> {
    return this.scoresService.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  async user({ id }) {
    return prisma.score.findUnique({ where: { id } }).user();
  }
}
