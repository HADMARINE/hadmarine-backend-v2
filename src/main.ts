import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  console.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
