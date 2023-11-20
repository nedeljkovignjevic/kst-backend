import { NestFactory } from '@nestjs/core';
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

  await app.listen(3000);
}
bootstrap();
