import { Test, TestingModule } from '@nestjs/testing';
import { InitialInspectionService } from './inspection.service';

describe('InitialInspectionService', () => {
  let service: InitialInspectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialInspectionService],
    }).compile();

    service = module.get<InitialInspectionService>(InitialInspectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
