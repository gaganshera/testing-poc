import { IsInt, IsString } from 'class-validator';

export class BuyEquityDto {
  @IsString()
  user_id: string;

  @IsInt()
  units: number;
}
