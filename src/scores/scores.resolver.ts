import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';
import { CreateScoreInput, CreateScoreOutput } from './dto/create-score.input';
import { CoreOutput } from '../common/dtos/output.dto';
import { Role } from '../auth/role.decorator';

@Resolver(() => Score)
export class ScoresResolver {
  constructor(private readonly scoresService: ScoresService) {}

  @Role(['Admin'])
  @Mutation(() => CreateScoreOutput)
  createScore(
    @Args('createScoreInput') createScoreInput: CreateScoreInput,
  ): Promise<CreateScoreOutput> {
    return this.scoresService.create(createScoreInput);
  }

  @Role(['Admin'])
  @Mutation(() => Score)
  removeScore(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CoreOutput> {
    return this.scoresService.remove(id);
  }
}
