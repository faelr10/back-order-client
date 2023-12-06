import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import { kafkaConfig } from './kafka.config';

export type request_order_payload = {
  origin: string;
  order_id: string;
  status: string;
};

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  constructor() {
    const client = new KafkaClient(kafkaConfig.client);
    this.producer = new Producer(client);
  }

  send(topic: string, payload: request_order_payload): void {
    const payloads: ProduceRequest[] = [
      {
        topic,
        messages: JSON.stringify(payload),
      },
    ];

    this.producer.send(payloads, (err) => {
      if (err) {
        console.error(`Erro ao enviar mensagem para o tópico ${topic}: ${err}`);
      }
    });
  }
}
