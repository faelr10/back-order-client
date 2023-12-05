import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaService } from 'src/prisma.service';
import { KafkaProducerService } from 'src/transporter/ kafka-producer.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    KafkaProducerService,
    PrismaService,
  ],
})
export class OrderModule {}
