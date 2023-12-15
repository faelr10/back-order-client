import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  private kafka: Kafka;
  private kafkaConsumer: Consumer;
  private kafkaProducer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CONSUMER_GROUP_ID,
      brokers: ['localhost:9092'],
    });

    this.kafkaConsumer = this.kafka.consumer({
      groupId: 'update',
    });

    this.kafkaConsumer.connect();
    this.kafkaConsumer.subscribe({ topic: 'update_order_topic' });

    this.kafkaProducer = this.kafka.producer();
  }

  handleConnection(client: Socket) {
    this.logger.log(`New client connection: ${client.id}`);
    const runKafkaConsumer = async () => {
      await this.kafkaConsumer.run({
        eachMessage: async ({ message }) => {
          const convert_message = JSON.parse(message.value.toString());
          client.emit('order_status_client', convert_message);
        },
      });
    };
    runKafkaConsumer();
  }

  // @SubscribeMessage('order_status')
  // handleEvent(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ): string {
  //   this.kafkaProducerService.send(request_order_topic, {
  //     order_id: '123456',
  //     origin: 'order.client.service',
  //     status: Status.PENDING,
  //   });

  //   client.emit('order_status', 'Client alerted!');
  //   return data;
  // }
}
