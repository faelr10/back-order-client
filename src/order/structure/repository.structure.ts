import { Account, Order, Product, Status } from '@prisma/client';
import { Or } from '@prisma/client/runtime/library';

export type InsertOrderParams = {
  account_id: string;
  product_id: string;
  status: Status;
};

export interface IOrderRepository {
  insertOrder(data: InsertOrderParams): Promise<Order>;
  existsAccount(where: Partial<Account | any>): Promise<Account>;
  existsProduct(where: Partial<Product | any>): Promise<Product>;
  existsOrder(where: Partial<Order> | any): Promise<Order>;
}
