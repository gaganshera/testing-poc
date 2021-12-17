import { Module } from '@nestjs/common';
import { EquitiesService } from './equities.service';
import { EquitiesController } from './equities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equity } from '../entities/equity.entity';
import { UserEquities } from '../entities/user_equity.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equity, UserEquities, User]),
    UsersModule,
  ],
  controllers: [EquitiesController],
  providers: [EquitiesService],
})
export class EquitiesModule {}
