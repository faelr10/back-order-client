import { Account, Order, Product, Status } from '@prisma/client';

export type InsertOrderParams = {
  account_id: string;
  status: Status;
  number_order_id: string;
  price: number;
  products: product[];
};

export type product = {
  product_id: string;
  quantity: number;
};

export interface IOrderRepository {
  insertOrder(data: InsertOrderParams): Promise<Order>;
  existsAccount(where: Partial<Account | any>): Promise<Account>;
  existsProduct(where: Partial<Product | any>): Promise<Product>;
  existsOrder(where: Partial<Order> | any): Promise<Order>;
}
