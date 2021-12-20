import { Test, TestingModule } from '@nestjs/testing';
import { EquitiesController } from './equities.controller';
import { EquitiesService } from './equities.service';
import { BuyEquityDto } from './dto/buy-equity.dto';
import { CreateEquityDto } from './dto/create-equity.dto';
import { Equity } from '../entities/equity.entity';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserEquities } from '../entities/user_equity.entity';

describe('EquitiesController', () => {
  let equitiesController: EquitiesController;
  let equitiesService: EquitiesService;
  let usersService: UsersService;

  jest.mock('express');

  const equity = new Equity();
  equity.id = '1234567';
  equity.cost = 10;
  equity.name = 'Equity-mock A';
  equity.units = 50;

  beforeEach(async () => {
    const EquitiesServiceProvider = {
      provide: EquitiesService,
      useFactory: () => ({
        create: jest.fn(async () => {
          return equity;
        }),
        findAll: jest.fn(() => [equity]),
        findOne: jest.fn((id) => {
          if (id === '111') return null;
          else return equity;
        }),
        update: jest.fn(() => {}),
        buy: jest.fn(() => {}),
        sell: jest.fn(() => {}),
        findUserEquity: jest.fn(async (userId, equityId) => {
          const userEquity = new UserEquities();
          userEquity.equity_id = equityId;
          userEquity.user_id = userId;
          userEquity.id = '987654321';
          if (userId === '1000') {
            userEquity.units_bought = 0;
          } else {
            userEquity.units_bought = 100;
          }
          return userEquity;
        }),
      }),
    };
    const userSeriveProvider = {
      provide: UsersService,
      useFactory: () => ({
        findOne: jest.fn().mockImplementation(async (id) => {
          if (id === '12345') {
            return null;
          }
          const user = new User();
          user.id = id;
          user.name = 'Gagan';
          if (id === '1234') user.funds = 1;
          else user.funds = 100;
          return user;
        }),
      }),
      forwardRef: '',
    };
    // const itemIssuanceRepositoryProvider = {
    //   provide: 'ItemIssuanceRepository',
    //   useClass: Repository,
    // };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquitiesController],
      providers: [
        EquitiesServiceProvider,
        userSeriveProvider,
        // itemIssuanceRepositoryProvider,
      ],
    }).compile();
    equitiesController = module.get<EquitiesController>(EquitiesController);
    equitiesService = module.get<EquitiesService>(EquitiesService);

    usersService = module.get<UsersService>(UsersService);
  });

  it('Save new equity', () => {
    const createEquity = new CreateEquityDto();
    equitiesController.create(createEquity);
    expect(equitiesService.create).toHaveBeenCalled();
    expect(equitiesService.create).toHaveBeenCalledWith(createEquity);
  });

  it('findAll equity', () => {
    equitiesController.findAll();
    expect(equitiesService.findAll).toHaveBeenCalled();
  });

  it('Buy equity insufficient funds', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234567890';
    buyEquity.units = 100;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.buyEquity(equity.id, buyEquity, res);
    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'INSUFFUCIENT_EQUITY_UNITS_LEFT',
      statusCode: 403,
    });
  });

  it('Buy equity invalid equity', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234567890';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const equity_id = '111';
    const resp = await equitiesController.buyEquity(equity_id, buyEquity, res);
    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity_id);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'INVALID_EQUITY',
      statusCode: 400,
    });
  });

  it('Buy equity invalid user', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '12345';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.buyEquity(equity.id, buyEquity, res);
    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);
    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'INVALID_USER',
      statusCode: 400,
    });
  });

  it('Buy equity user funds insufficient', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.buyEquity(equity.id, buyEquity, res);
    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);
    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'FUNDS_INSUFFICIENT',
      statusCode: 403,
    });
  });

  it('Buy equity internal server error', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234567890';
    buyEquity.units = 100;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnValueOnce(null).mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.buyEquity(equity.id, buyEquity, res);
    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: "Cannot read property 'json' of null",
      statusCode: 500,
    });
  });

  it('Buy equity success', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234567890';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.buyEquity(equity.id, buyEquity, res);
    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);

    expect(equitiesService.buy).toHaveBeenCalled();
    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'SUCCESS',
      statusCode: 200,
    });
  });

  it('Sell equity invalid user', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '12345';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.sellEquity(equity.id, buyEquity, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);
    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'INVALID_USER',
      statusCode: 400,
    });
  });

  it('Sell equity invalid equity', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234567890';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const equity_id = '111';
    const resp = await equitiesController.sellEquity(equity_id, buyEquity, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);

    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity_id);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'INVALID_EQUITY',
      statusCode: 400,
    });
  });

  it('Sell equity user does not have quantity to sell', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1000';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.sellEquity(equity.id, buyEquity, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);

    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(equitiesService.findUserEquity).toHaveBeenCalled();
    expect(equitiesService.findUserEquity).toHaveBeenCalledWith(
      buyEquity.user_id,
      equity.id,
    );

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'SELL_NOT_ALLOWED',
      statusCode: 403,
    });
  });

  it('Sell equity internal server error', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '12345';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnValueOnce(null).mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.sellEquity(equity.id, buyEquity, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);
    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: "Cannot read property 'json' of null",
      statusCode: 500,
    });
  });

  it('Sell equity success', async () => {
    const buyEquity = new BuyEquityDto();
    buyEquity.user_id = '1234567890';
    buyEquity.units = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const resp = await equitiesController.sellEquity(equity.id, buyEquity, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(buyEquity.user_id);

    expect(equitiesService.findOne).toHaveBeenCalled();
    expect(equitiesService.findOne).toHaveBeenCalledWith(equity.id);

    expect(equitiesService.findUserEquity).toHaveBeenCalled();
    expect(equitiesService.findUserEquity).toHaveBeenCalledWith(
      buyEquity.user_id,
      equity.id,
    );

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'SUCCESS',
      statusCode: 200,
    });
  });
});
