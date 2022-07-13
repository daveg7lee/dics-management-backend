import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import MercuriusGQLUpload from 'mercurius-upload';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.useGlobalPipes(new ValidationPipe());

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.register(MercuriusGQLUpload);

  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
