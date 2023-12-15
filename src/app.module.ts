import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [OrderModule],
  providers: [EventsGateway],
})
export class AppModule {}
