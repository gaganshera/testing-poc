import { Injectable } from '@nestjs/common';
import { CreateEquityDto } from './dto/create-equity.dto';
import { UpdateEquityDto } from './dto/update-equity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equity } from '../entities/equity.entity';
import { User } from 'src/entities/user.entity';
import { BuyEquityDto } from './dto/buy-equity.dto';
import { UserEquities } from 'src/entities/user_equity.entity';

@Injectable()
export class EquitiesService {
  constructor(
    @InjectRepository(Equity)
    private equitiesRepository: Repository<Equity>,
    @InjectRepository(UserEquities)
    private userEquitiesRepository: Repository<UserEquities>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createEquityDto: CreateEquityDto) {
    const equity = new Equity();
    equity.name = createEquityDto.name;
    equity.units = createEquityDto.units;
    equity.cost = createEquityDto.cost;

    return this.equitiesRepository.save(equity);
  }

  findAll() {
    return this.equitiesRepository.find();
  }

  findOne(id: string) {
    return this.equitiesRepository.findOne(id);
  }

  update(id: string, updateEquityDto: UpdateEquityDto) {
    return this.equitiesRepository.update({ id }, updateEquityDto);
  }

  findUserEquity(userId: string, equityId: string) {
    return this.userEquitiesRepository.findOne({
      user_id: userId,
      equity_id: equityId,
    });
  }

  async buy(user: User, equity: Equity, buyEquityDto: BuyEquityDto) {
    try {
      //subtract units available in entity
      equity.units = equity.units - buyEquityDto.units;
      await this.equitiesRepository.save(equity);

      const totalCostPrice = equity.cost * buyEquityDto.units;

      //subtract funds from user
      user.funds = user.funds - totalCostPrice;
      await this.userRepository.save(user);

      //update user-entity table
      const userEquity = await this.userEquitiesRepository.findOne({
        user_id: user.id,
        equity_id: equity.id,
      });
      if (userEquity) {
        //user already has this equity, update the count
        userEquity.units_bought = userEquity.units_bought + buyEquityDto.units;
        await this.userEquitiesRepository.save(userEquity);
      } else {
        //add new entry
        const userEquity = new UserEquities();
        userEquity.equity_id = equity.id;
        userEquity.user_id = user.id;
        userEquity.units_bought = buyEquityDto.units;
        await this.userEquitiesRepository.save(userEquity);
      }
    } catch (error) {
      console.log(error);
      throw new Error('BUY_ERROR');
    }
  }

  async sell(
    user: User,
    equity: Equity,
    userEquity: UserEquities,
    sellEquityDto: BuyEquityDto,
  ) {
    try {
      //add units back to equity
      equity.units = equity.units + sellEquityDto.units;
      await this.equitiesRepository.save(equity);

      //calculate total cost
      const totalCostPrice = equity.cost * sellEquityDto.units;

      //add funds back to user
      user.funds = user.funds + totalCostPrice;
      await this.userRepository.save(user);

      //deduct equity units from user
      userEquity.units_bought = userEquity.units_bought - sellEquityDto.units;
      await this.userEquitiesRepository.save(userEquity);
    } catch (error) {
      console.log(error);
      throw new Error('SELL_ERROR');
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} equity`;
  // }
}
