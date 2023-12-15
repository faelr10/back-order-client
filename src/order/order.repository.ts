import { Account, Order, Product } from '@prisma/client';
import {
  IOrderRepository,
  InsertOrderParams,
} from './structure/repository.structure';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  insertOrder(data: InsertOrderParams): Promise<Order> {
    const { number_order_id, price, status, account_id, products } = data;

    return this.prisma.order.create({
      data: {
        number_order_id,
        price,
        status,
        account_id,
        OrderProduct: {
          create: products,
        },
      },
    });
  }

  existsAccount(where: Partial<Account | any>): Promise<Account> {
    return this.prisma.account.findFirst({ where });
  }

  existsProduct(where: Partial<Product | any>): Promise<Product> {
    return this.prisma.product.findFirst({ where });
  }

  existsOrder(where: Partial<Order> | any): Promise<Order> {
    return this.prisma.order.findFirst({ where });
  }
}
