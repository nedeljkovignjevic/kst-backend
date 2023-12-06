import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // remove undeclared properties from request
      whitelist: true,
      // block requests with undeclared properties
      forbidNonWhitelisted: true,
      // all params come as strings via network.
      // This will transform strings to whatever type is declared
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('KST Backend')
    .setDescription('KST Backend description')
    .setVersion('1.0')
    .addTag('kst')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
