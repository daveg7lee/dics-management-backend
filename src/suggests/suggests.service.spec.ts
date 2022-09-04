import { Test, TestingModule } from '@nestjs/testing';
import { SuggestsService } from './suggests.service';

describe('SuggestsService', () => {
  let service: SuggestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestsService],
    }).compile();

    service = module.get<SuggestsService>(SuggestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
