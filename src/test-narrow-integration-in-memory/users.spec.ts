import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../../src/users/users.module';
import { EquitiesModule } from '../../src/equities/equities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { UserEquities } from '../../src/entities/user_equity.entity';
import { Equity } from '../../src/entities/equity.entity';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

describe('Users Integration', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  const users = [
    {
      id: '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6',
      name: 'User 2',
      funds: 340,
    },
    {
      id: '54e237f4-7a0c-43fa-9158-d3bf6d6c224b',
      name: 'User 3',
      funds: 220,
    },
    {
      id: 'fdad5b6f-9890-49aa-aba7-a8228508f582',
      name: 'User 1',
      funds: 19200,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        EquitiesModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'e2e_test',
          entities: [User, UserEquities, Equity],
          synchronize: true,
          logging: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = moduleFixture.get('UserRepository');
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    await userRepository.save(users);
  });
  afterEach(async () => {
    await userRepository.clear();
  });

  it('/users (GET)', async () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect(users);
  });

  it('/users (POST)', async () => {
    const createUserDto: CreateUserDto = { funds: 200, name: 'User-int' };
    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('/addFunds/:id (POST)', async () => {
    await request(app.getHttpServer())
      .post(`/users/addFunds/${users[0].id}`)
      .send({ funds: 100 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ statusCode: 200, message: 'SUCCESS' });
  });
});
