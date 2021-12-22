import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EquitiesService } from './equities.service';
import { CreateEquityDto } from './dto/create-equity.dto';
import { BuyEquityDto } from './dto/buy-equity.dto';
import { CommonFunctions as cf } from '../common/common-functions';
import { UsersService } from '../users/users.service';

@Controller('equities')
export class EquitiesController {
  constructor(
    private readonly equitiesService: EquitiesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createEquityDto: CreateEquityDto) {
    return this.equitiesService.create(createEquityDto);
  }

  @Get()
  findAll() {
    return this.equitiesService.findAll();
  }

  @Post('/buy/:equityId')
  async buyEquity(
    @Param('equityId') equityId: string,
    @Body() buyEquityDto: BuyEquityDto,
    @Res() res: Response,
  ) {
    try {
      //check if time is correct
      if (!cf.isBuySellTime()) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'INVALID_TIME',
        });
      }

      const equity = await this.equitiesService.findOne(equityId);
      if (!equity) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'INVALID_EQUITY',
        });
      }

      //check if equity units are available as per asked by buyer
      if (equity.units < buyEquityDto.units) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'INSUFFUCIENT_EQUITY_UNITS_LEFT',
        });
      }

      //calculate equity total price (cost * units)
      const totalCostPrice = equity.cost * buyEquityDto.units;

      // check if user has balance (user funds >= total price)
      const user = await this.usersService.findOne(buyEquityDto.user_id);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'INVALID_USER',
        });
      }
      console.log('FUNDS=>', user.funds, totalCostPrice);
      if (user.funds < totalCostPrice) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'FUNDS_INSUFFICIENT',
        });
      }
      console.log(equity, user);
      await this.equitiesService.buy(user, equity, buyEquityDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
      });
    } catch (error) {
      console.log('Error in buyEquity', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Post('/sell/:equityId')
  async sellEquity(
    @Param('equityId') equityId: string,
    @Body() sellEquityDto: BuyEquityDto,
    @Res() res: Response,
  ) {
    try {
      //check if time is correct
      if (!cf.isBuySellTime()) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'INVALID_TIME',
        });
      }

      const user = await this.usersService.findOne(sellEquityDto.user_id);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'INVALID_USER',
        });
      }

      const equity = await this.equitiesService.findOne(equityId);
      if (!equity) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'INVALID_EQUITY',
        });
      }

      const userEquity = await this.equitiesService.findUserEquity(
        user.id,
        equity.id,
      );
      //check if the user has the units of equity to sell
      if (!userEquity || userEquity.units_bought < sellEquityDto.units) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'SELL_NOT_ALLOWED',
        });
      }

      console.log(user, equity);
      await this.equitiesService.sell(user, equity, userEquity, sellEquityDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}
