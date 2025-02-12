import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes';
import { CatchEverythingFilter } from './error-handler';
import { Logger } from '@nestjs/common';

const start = async () => {
  const PORT = process.env.PORT || 5000;
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ['content-type', 'authorization'],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  await app.listen(PORT, () => logger.log(`Server started on port = ${PORT}`));
};

start();
