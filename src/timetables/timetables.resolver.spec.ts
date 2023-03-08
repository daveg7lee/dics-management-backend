import { Test, TestingModule } from '@nestjs/testing';
import { TimetablesResolver } from './timetables.resolver';
import { TimetablesService } from './timetables.service';

describe('TimetablesResolver', () => {
  let resolver: TimetablesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimetablesResolver, TimetablesService],
    }).compile();

    resolver = module.get<TimetablesResolver>(TimetablesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
