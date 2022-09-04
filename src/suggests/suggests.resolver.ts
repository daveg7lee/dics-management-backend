import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SuggestsService } from './suggests.service';
import { Suggest } from './entities/suggest.entity';
import { CreateSuggestInput } from './dto/create-suggest.input';
import { UpdateSuggestInput } from './dto/update-suggest.input';
import { CoreOutput } from '../common/dtos/output.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { Auth } from '../auth/auth.decorator';
import { User } from '../users/entities/user.entity';
import { SuggestsOutput } from './dto/suggests.dto';

@Resolver(() => Suggest)
export class SuggestsResolver {
  constructor(private readonly suggestsService: SuggestsService) {}

  @Auth(['Any'])
  @Mutation(() => CoreOutput)
  createSuggest(
    @Args('createSuggestInput') createSuggestInput: CreateSuggestInput,
    @AuthUser() user: User,
  ): Promise<CoreOutput> {
    return this.suggestsService.create(createSuggestInput, user);
  }

  @Auth(['Admin'])
  @Query(() => SuggestsOutput, { name: 'suggests' })
  findAll() {
    return this.suggestsService.findAll();
  }

  @Auth(['Any'])
  @Query(() => SuggestsOutput, { name: 'findMySuggests' })
  findMySuggests(@AuthUser() user: User) {
    return this.suggestsService.findMy(user);
  }

  @Mutation(() => CoreOutput)
  updateSuggest(
    @Args('updateSuggestInput') updateSuggestInput: UpdateSuggestInput,
  ): Promise<CoreOutput> {
    return this.suggestsService.update(
      updateSuggestInput.id,
      updateSuggestInput,
    );
  }

  @Mutation(() => CoreOutput)
  removeSuggest(@Args('id', { type: () => String }) id: string) {
    return this.suggestsService.remove(id);
  }
}
