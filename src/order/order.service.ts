import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Order, Status } from '@prisma/client';
import {
  GetOrderParams,
  IOrderService,
  NewOrderParams,
} from './structure/service.structure';
import { OrderRepository } from './order.repository';
import { IOrderRepository } from './structure/repository.structure';
import { KafkaProducerService } from 'src/transporter/ kafka-producer.service';
import { request_order_topic } from 'src/transporter/kafka.config';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(OrderRepository) private readonly repository: IOrderRepository,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async newOrder(data: NewOrderParams): Promise<Order> {
    const accountExists = await this.repository.existsAccount({
      id: data.account_id,
    });
    if (!accountExists) {
      throw new BadRequestException('Account not found!');
    }

    let price = 0;
    const products_name = [];

    await Promise.all(
      data.products.map(async (product) => {
        const product_exist = await this.repository.existsProduct({
          id: product.product_id,
        });
        price += Number(product_exist.price) * product.quantity;
        products_name.push(product_exist.name);
      }),
    );

    const numberOrderId = generateRandomNumberString(8);

    const newOrder = await this.repository.insertOrder({
      account_id: data.account_id,
      status: Status.PENDING,
      number_order_id: numberOrderId,
      price,
      products: data.products,
    });

    newOrder.price = new Decimal(parseFloat(price.toFixed(2)));

    this.kafkaProducerService.send(request_order_topic, {
      order_id: newOrder.number_order_id,
      origin: 'order.client.service',
      status: newOrder.status,
      account_name: accountExists.name,
      product_name: products_name,
    });

    return newOrder;
  }

  async getInfoOrder(data: GetOrderParams): Promise<Order> {
    const order = await this.repository.existsOrder(data.id);
    if (!order) {
      throw new BadRequestException('Order not found!');
    }
    return order;
  }
}

function generateRandomNumberString(length) {
  const numbers = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers.charAt(randomIndex);
  }

  return result;
}
