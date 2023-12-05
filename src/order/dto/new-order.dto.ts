import { IsString } from 'class-validator';

export class NewOrderDto {
  @IsString()
  account_id: string;

  @IsString()
  product_id: string;
}
