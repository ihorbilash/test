import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mongoConfig } from './config/mongoConfig';
import { AmqpModule } from './services/amqp/amqp.module';
import { MessageModule } from './services/message/message.module';
import { ImageModule } from './services/image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonEnum } from './common/common.enum';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(mongoConfig),
    AmqpModule,
    MessageModule,
    ImageModule,
    ServeStaticModule.forRoot({
      rootPath: CommonEnum.FILES_PUBLIC_PATH,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
