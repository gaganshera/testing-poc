import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const user = new User();
  user.id = '1234567890';
  user.name = 'Gagan';
  user.funds = 100;

  beforeEach(async () => {
    const usersServiceProvider = {
      provide: UsersService,
      useFactory: () => ({
        create: jest.fn(async () => {
          return user;
        }),
        findAll: jest.fn(() => [user]),
        findOne: jest.fn((id) => {
          if (id === '12345') return null;
          else return user;
        }),
        update: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [usersServiceProvider],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('create user', () => {
    const createuser = new CreateUserDto();
    usersController.create(createuser);
    expect(usersService.create).toHaveBeenCalled();
    expect(usersService.create).toHaveBeenCalledWith(createuser);
  });

  it('findAll users', () => {
    usersController.findAll();
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('Add user funds invalid user', async () => {
    const updateUser = new UpdateUserDto();
    updateUser.funds = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };

    const user_id = '12345';
    await usersController.addFunds(user_id, updateUser, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(user_id);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'INVALID_USER',
      statusCode: 400,
    });
  });

  it('Add user funds internal server error', async () => {
    const updateUser = new UpdateUserDto();
    updateUser.funds = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnValueOnce(null).mockReturnThis(),
      json: resJsonMock,
    };

    const user_id = '12345';
    await usersController.addFunds(user_id, updateUser, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(user_id);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: "Cannot read property 'json' of null",
      statusCode: 500,
    });
  });

  it('Add user funds success', async () => {
    const updateUser = new UpdateUserDto();
    updateUser.funds = 10;
    const resJsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: resJsonMock,
    };
    const updatedUser = { funds: 110, id: user.id, name: user.name };

    await usersController.addFunds(user.id, updateUser, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(usersService.findOne).toHaveBeenCalledWith(user.id);

    expect(usersService.update).toHaveBeenCalled();
    expect(usersService.update).toHaveBeenCalledWith(user.id, updatedUser);

    expect(resJsonMock.mock.calls[0][0]).toEqual({
      message: 'SUCCESS',
      statusCode: 200,
    });
  });
});
