import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('BACKEND ENGINEERING TASK')
    .setDescription('The TEST API , here you can check the endpoints')
    .setVersion('1.0')
    .addTag('REST app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.listen(PORT, () => {
    console.log(`Server app on ${PORT} port`);
  });
}
bootstrap();
