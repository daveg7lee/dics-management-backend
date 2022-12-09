import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SuggestsService } from './suggests.service';
import { Suggest } from './entities/suggest.entity';
import { CreateSuggestInput, SuggestOutput } from './dto/create-suggest.input';
import {
  UpdateSuggestInput,
  UpdateSuggestOutput,
} from './dto/update-suggest.input';
import { CoreOutput } from '../common/dtos/output.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { Auth } from '../auth/auth.decorator';
import { User } from '../users/entities/user.entity';
import { SuggestsOutput } from './dto/suggests.dto';
import {
  ReplySuggestInput,
  ReplySuggestOutput,
} from './dto/reply-suggest.input';

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
  @Query(() => SuggestsOutput, { name: 'findAllWaiting' })
  findAllWaiting() {
    return this.suggestsService.findAll('waiting');
  }

  @Auth(['Admin'])
  @Query(() => SuggestsOutput, { name: 'findAllProcessing' })
  findAllProcessing() {
    return this.suggestsService.findAll('processing');
  }

  @Auth(['Admin'])
  @Query(() => SuggestsOutput, { name: 'findAllDone' })
  findAllDone() {
    return this.suggestsService.findAll('done');
  }

  @Auth(['Admin'])
  @Query(() => SuggestsOutput, { name: 'findAllDecline' })
  findAllDecline() {
    return this.suggestsService.findAll('decline');
  }

  @Auth(['Any'])
  @Query(() => SuggestOutput, { name: 'suggest' })
  findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<SuggestOutput> {
    return this.suggestsService.findOne(id);
  }

  @Auth(['Any'])
  @Query(() => SuggestsOutput, { name: 'findMySuggests' })
  findMySuggests(@AuthUser() user: User) {
    return this.suggestsService.findMy(user);
  }

  @Auth(['Any'])
  @Mutation(() => UpdateSuggestOutput)
  updateSuggest(
    @Args('updateSuggestInput') updateSuggestInput: UpdateSuggestInput,
  ): Promise<UpdateSuggestOutput> {
    return this.suggestsService.update(
      updateSuggestInput.id,
      updateSuggestInput,
    );
  }

  @Auth(['Any'])
  @Mutation(() => CoreOutput)
  removeSuggest(@Args('id', { type: () => String }) id: string) {
    return this.suggestsService.remove(id);
  }

  @Auth(['Any'])
  @Mutation(() => ReplySuggestOutput)
  replyTo(
    @Args('replySuggestInput') replySuggestInput: ReplySuggestInput,
    @AuthUser() user,
  ): Promise<ReplySuggestOutput> {
    return this.suggestsService.replyTo(
      replySuggestInput.id,
      replySuggestInput.text,
      user,
    );
  }
}
