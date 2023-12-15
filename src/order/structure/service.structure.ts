import { Order } from '@prisma/client';

export type NewOrderParams = {
  account_id: string;
  products: ProductsOrder[];
};

export type ProductsOrder = {
  product_id: string;
  quantity: number;
};

export type GetOrderParams = {
  id: string;
};

export interface IOrderService {
  newOrder(data: NewOrderParams): Promise<Order>;
  getInfoOrder(data: GetOrderParams): Promise<Order>;
}
