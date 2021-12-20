/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EquitiesModule } from './equities/equities.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(), EquitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
