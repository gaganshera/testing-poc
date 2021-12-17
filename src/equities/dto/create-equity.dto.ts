import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateEquityDto {
  @IsString()
  name: string;

  @IsInt()
  units: number;

  @IsNumber()
  cost: number;
}
