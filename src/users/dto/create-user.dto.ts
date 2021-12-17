import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  funds: number;
}
