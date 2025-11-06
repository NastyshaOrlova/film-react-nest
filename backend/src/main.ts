import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerType = process.env.LOGGER_TYPE;

  if (loggerType === 'tskv') {
    app.useLogger(new TskvLogger());
  } else if (loggerType === 'json') {
    app.useLogger(new JsonLogger());
  } else {
    app.useLogger(new DevLogger());
  }

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
