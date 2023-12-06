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

    const productExists = await this.repository.existsProduct({
      id: data.product_id,
    });
    if (!productExists) {
      throw new BadRequestException('Product not found!');
    }

    const newOrder = await this.repository.insertOrder({
      account_id: data.account_id,
      product_id: data.product_id,
      status: Status.PENDING,
    });

    this.kafkaProducerService.send(request_order_topic, {
      order_id: newOrder.id,
      origin: 'order.client.service',
      status: newOrder.status,
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
