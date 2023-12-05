import { Controller, Post, Body, Inject } from '@nestjs/common';
import { NewOrderDto } from './dto/new-order.dto';
import { OrderService } from './order.service';
import { IOrderService } from './structure/service.structure';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: IOrderService,
  ) {}

  @Post()
  newOrder(@Body() createOrderDto: NewOrderDto) {
    return this.orderService.newOrder(createOrderDto);
  }
}
