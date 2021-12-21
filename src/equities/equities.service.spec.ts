import { Test, TestingModule } from '@nestjs/testing';
import { Equity } from '../entities/equity.entity';
import { Repository } from 'typeorm';
import { EquitiesService } from './equities.service';
import { UserEquities } from '../entities/user_equity.entity';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BuyEquityDto } from './dto/buy-equity.dto';

describe('EquitiesService', () => {
  let equityService: EquitiesService;
  let equityRepository: Repository<Equity>;
  let userEquityRepository: Repository<UserEquities>;
  let userRepository: Repository<User>;

  const equity = new Equity();
  equity.name = 'Test Equity';
  equity.units = 100;
  equity.cost = 20;
  equity.id = '1234567';

  const user = new User();
  user.name = 'test';
  user.funds = 10;
  user.id = '1234567890';

  beforeEach(async () => {
    const equityRepositoryProvider = {
      provide: 'EquityRepository',
      useFactory: () => ({
        find: jest.fn(() => {}),
        save: jest.fn(() => {}),
        findOne: jest.fn(() => {}),
        update: jest.fn(() => {}),
      }),
    };

    const userEquityRepositoryProvider = {
      provide: 'UserEquitiesRepository',
      useFactory: () => ({
        find: jest.fn(() => {}),
        save: jest.fn(() => {}),
        findOne: jest.fn(() => {}),
        update: jest.fn(() => {}),
      }),
    };

    const userRepositoryProvider = {
      provide: 'UserRepository',
      useFactory: () => ({
        find: jest.fn(() => {}),
        save: jest.fn(() => {}),
        findOne: jest.fn(() => {}),
        update: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquitiesService,
        equityRepositoryProvider,
        userEquityRepositoryProvider,
        userRepositoryProvider,
      ],
    }).compile();

    equityService = module.get<EquitiesService>(EquitiesService);
    equityRepository = module.get(getRepositoryToken(Equity));
    userEquityRepository = module.get(getRepositoryToken(UserEquities));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('equity findall', () => {
    equityService.findAll();
    expect(equityRepository.find).toHaveBeenCalled();
  });

  it('equity create', () => {
    equityService.create(equity);
    expect(equityRepository.save).toHaveBeenCalled();
  });

  it('equity findOne', () => {
    equityService.findOne(equity.id);
    expect(equityRepository.findOne).toHaveBeenCalled();
  });

  it('equity findUserEquity', () => {
    equityService.findUserEquity(user.id, equity.id);
    expect(userEquityRepository.findOne).toHaveBeenCalled();
  });

  it('equity buy', async () => {
    const buyEquityDto = new BuyEquityDto();
    buyEquityDto.units = 1;
    buyEquityDto.user_id = user.id;
    await equityService.buy(user, equity, buyEquityDto);
    expect(equityRepository.save).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalled();
    expect(userEquityRepository.findOne).toHaveBeenCalled();
    expect(userEquityRepository.save).toHaveBeenCalled();
  });

  it('equity sell', async () => {
    const sellEquityDto = new BuyEquityDto();
    sellEquityDto.units = 1;
    sellEquityDto.user_id = user.id;
    const userEquity: any = {
      equity_id: equity.id,
      id: '987',
      units_bought: 1,
      user_id: user.id,
    };
    await equityService.sell(user, equity, userEquity, sellEquityDto);
    expect(equityRepository.save).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalled();
    expect(userEquityRepository.save).toHaveBeenCalled();
  });
});
