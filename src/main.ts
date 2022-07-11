import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(require('fastify-cors'), {
    origin: ['http://127.0.0.1:3000', "https://dics.netlify.app"],
    methods: ['POST'],
  });

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
