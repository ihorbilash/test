import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { User } from 'src/entities/user/entity/user.entity';

@Injectable()
export class MessageService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendMessage(user: User): Promise<boolean> {
    return await this.amqpConnection.publish('post', 'create-post', user);
  }

  @RabbitRPC({
    exchange: 'post',
    routingKey: 'create-post',
    queue: 'create-post',
  })
  private async getMessageFromQueue(msg: object) {
    console.log('msq=>', msg);
  }
}
