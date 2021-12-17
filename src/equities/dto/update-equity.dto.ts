import { PartialType } from '@nestjs/mapped-types';
import { CreateEquityDto } from './create-equity.dto';
import { IsString, IsNumber, IsInt } from 'class-validator';

export class UpdateEquityDto extends PartialType(CreateEquityDto) {
  @IsString()
  name: string;

  @IsInt()
  units: number;

  @IsNumber()
  cost: number;
}
