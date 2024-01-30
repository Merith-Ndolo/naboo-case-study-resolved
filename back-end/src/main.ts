import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  await seedService.seedDefaultUser();
  await app.listen(3000);
}
bootstrap();
