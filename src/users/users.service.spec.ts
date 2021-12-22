import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  const user = new User();
  user.name = 'test';
  user.funds = 10;
  user.id = '1234567890';

  beforeEach(async () => {
    const usersRepositoryProvider = {
      provide: 'UserRepository',
      useFactory: () => ({
        find: jest.fn(() => {}),
        save: jest.fn(() => {}),
        findOne: jest.fn(() => {}),
        update: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, usersRepositoryProvider],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('users findall', () => {
    userService.findAll();
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('users create', () => {
    userService.create(user);
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('users findOne', () => {
    userService.findOne(user.id);
    expect(userRepository.findOne).toHaveBeenCalled();
  });

  it('users update', () => {
    userService.update(user.id, user);
    expect(userRepository.update).toHaveBeenCalled();
  });
});
