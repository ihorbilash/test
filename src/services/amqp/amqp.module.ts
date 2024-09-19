import { Global, Module } from '@nestjs/common';
import {
  RabbitMQModule,
  RabbitRpcParamsFactory,
  AmqpConnectionManager,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { amqpConfig } from 'src/config/amqpConfig';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => amqpConfig(configService),
    }),
  ],
  providers: [RabbitRpcParamsFactory, AmqpConnectionManager],
  exports: [RabbitMQModule],
})
export class AmqpModule {}
