import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ScoresModule } from './scores/scores.module';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { SuggestsModule } from './suggests/suggests.module';

@Module({
  imports: [
    UsersModule,
    ScoresModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      autoSchemaFile: true,
      context: (req) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req.headers[TOKEN_KEY],
        };
      },
    }),
    SuggestsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
