import { Test, TestingModule } from '@nestjs/testing';
import { InitialInspectionController } from './inspection.controller';

describe('InitialInspectionController', () => {
  let controller: InitialInspectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitialInspectionController],
    }).compile();

    controller = module.get<InitialInspectionController>(
      InitialInspectionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
