import { IsArray, IsString } from 'class-validator';
import { ProductsOrder } from '../structure/service.structure';

export class NewOrderDto {
  @IsString()
  account_id: string;

  @IsArray()
  products: [ProductsOrder];
}
