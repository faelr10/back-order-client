import { Order } from '@prisma/client';

export type NewOrderParams = {
  account_id: string;
  product_id: string;
};

export interface IOrderService {
  newOrder(data: NewOrderParams): Promise<Order>;
}