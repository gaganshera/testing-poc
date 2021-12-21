import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { EquitiesModule } from '../src/equities/equities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { UserEquities } from '../src/entities/user_equity.entity';
import { Equity } from '../src/entities/equity.entity';
import { CreateEquityDto } from '../src/equities/dto/create-equity.dto';
import { DateTime } from 'luxon';

describe('Users Integration', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let equityRepository: Repository<Equity>;
  let usersEquityRepository: Repository<UserEquities>;

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

  const equities = [
    {
      id: '65a16a9e-297a-4ac3-9fe5-551f098183d5',
      name: 'Equity 2',
      cost: 8,
      units: 30,
    },
    {
      id: '804cc263-c37c-4851-befc-c32da1bc30fe',
      name: 'Equity 3',
      cost: 100,
      units: 97,
    },
    {
      id: 'eeef4fbe-d836-4336-98e7-be131c3455ee',
      name: 'Equity 1',
      cost: 120,
      units: 110,
    },
  ];

  const user_bought_equities = [
    {
      id: '88ac85b0-f2b6-40af-8bc7-90db1364af8a',
      user_id: '54e237f4-7a0c-43fa-9158-d3bf6d6c224b',
      equity_id: '804cc263-c37c-4851-befc-c32da1bc30fe',
      units_bought: 1,
    },
    {
      id: 'bd1370cb-0e66-4a59-b7c1-58cf0a717813',
      user_id: '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6',
      equity_id: 'eeef4fbe-d836-4336-98e7-be131c3455ee',
      units_bought: 0,
    },
    {
      id: 'c080eda3-50a9-4284-965e-04e3d97094e0',
      user_id: 'fdad5b6f-9890-49aa-aba7-a8228508f582',
      equity_id: 'eeef4fbe-d836-4336-98e7-be131c3455ee',
      units_bought: 90,
    },
    {
      id: 'c8492ab5-dcc6-42bf-9afd-eb7b434a4da8',
      user_id: '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6',
      equity_id: '804cc263-c37c-4851-befc-c32da1bc30fe',
      units_bought: 2,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        EquitiesModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'user',
          password: 'Zainwaw@123',
          database: 'traders-2',
          entities: [User, UserEquities, Equity],
          synchronize: true,
          logging: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = await moduleFixture.get('UserRepository');
    equityRepository = await moduleFixture.get('EquityRepository');
    usersEquityRepository = await moduleFixture.get('UserEquitiesRepository');

    await usersEquityRepository.clear();
    await equityRepository.clear();
    await userRepository.clear();

    jest
      .spyOn(DateTime, 'now')
      .mockImplementation(() => DateTime.fromISO('2021-12-22T16:30:00'));
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    await userRepository.save(users);
    await equityRepository.save(equities);
    await usersEquityRepository.save(user_bought_equities);
  });
  afterEach(async () => {
    try {
      await usersEquityRepository.clear();
      await equityRepository.clear();
      await userRepository.clear();
    } catch (error) {
      console.log('AfterEach Error', error);
    }
  });

  it('/equities (GET)', async () => {
    return request(app.getHttpServer())
      .get('/equities')
      .expect(200)
      .expect(equities);
  });

  it('/equities (POST)', async () => {
    const createEquityDto: CreateEquityDto = {
      cost: 10,
      name: 'Equity-int',
      units: 100,
    };
    return request(app.getHttpServer())
      .post('/equities')
      .send(createEquityDto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('/buy/:equityId (POST)', async () => {
    await request(app.getHttpServer())
      .post(`/equities/buy/${equities[0].id}`)
      .send({ units: 2, user_id: '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ statusCode: 200, message: 'SUCCESS' });
  });

  it('/buy/:equityId (POST) user has equity', async () => {
    await request(app.getHttpServer())
      .post(`/equities/buy/${equities[1].id}`)
      .send({ units: 2, user_id: '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ statusCode: 200, message: 'SUCCESS' });
  });
});
