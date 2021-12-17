import { Test, TestingModule } from '@nestjs/testing';
import { EquitiesController } from './equities.controller';
import { EquitiesService } from './equities.service';

describe('EquitiesController', () => {
  let controller: EquitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquitiesController],
      providers: [EquitiesService],
    }).compile();

    controller = module.get<EquitiesController>(EquitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
