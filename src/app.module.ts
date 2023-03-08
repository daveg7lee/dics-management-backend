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
import { SuggestsModule } from './suggests/suggests.module';
import { AdminModule } from '@adminjs/nestjs';
import { ApolloDriver } from '@nestjs/apollo';
import * as AdminJSPrisma from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { PrismaClient } from '@prisma/client';
import { DMMFClass } from '@prisma/client/runtime';
import { PrismaModule } from './prisma/prisma.module';
import { TimetablesModule } from './timetables/timetables.module';

AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
});

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => {
        const prisma = new PrismaClient();
        const dmmf = (prisma as any)._baseDmmf as DMMFClass;

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: { model: dmmf.modelMap.User, client: prisma },
                options: {
                  navigation: { name: '학생 및 벌점 관리', icon: 'User' },
                  listProperties: ['grade', 'username', 'email', 'type'],
                  editProperties: ['username', 'email', 'grade', 'type'],
                  showProperties: ['username', 'email', 'grade', 'type'],
                  filterProperties: [
                    'username',
                    'email',
                    'grade',
                    'type',
                    'createdAt',
                  ],
                },
              },
              {
                resource: { model: dmmf.modelMap.Score, client: prisma },
                options: {
                  navigation: { name: '학생 및 벌점 관리', icon: 'User' },
                  listProperties: [
                    'uploader',
                    'user',
                    'type',
                    'score',
                    'article',
                    'detail',
                    'date',
                  ],
                  editProperties: [
                    'uploader',
                    'user',
                    'type',
                    'score',
                    'article',
                    'detail',
                    'date',
                  ],
                  showProperties: [
                    'uploader',
                    'user',
                    'type',
                    'score',
                    'article',
                    'detail',
                    'date',
                  ],
                  filterProperties: [
                    'uploader',
                    'user',
                    'type',
                    'score',
                    'article',
                    'date',
                  ],
                },
              },
              {
                resource: { model: dmmf.modelMap.Suggest, client: prisma },
                options: {
                  properties: {
                    text: {
                      isVisible: {
                        edit: false,
                        show: true,
                        list: true,
                        filter: false,
                      },
                      type: 'richtext',
                      custom: {},
                    },
                  },
                  navigation: { name: '소리함 관리' },
                  listProperties: [
                    'title',
                    'text',
                    'user',
                    'type',
                    'status',
                    'createdAt',
                  ],
                  showProperties: [
                    'title',
                    'text',
                    'user',
                    'type',
                    'status',
                    'createdAt',
                  ],
                  filterProperties: [
                    'title',
                    'text',
                    'user',
                    'type',
                    'status',
                    'createdAt',
                  ],
                },
              },
              {
                resource: { model: dmmf.modelMap.Reply, client: prisma },
                options: {
                  navigation: { name: '소리함 관리' },
                  listProperties: ['user', 'suggest', 'text', 'createdAt'],
                  editProperties: ['user', 'suggest', 'text', 'createdAt'],
                  showProperties: ['user', 'suggest', 'text', 'createdAt'],
                  filterProperties: ['user', 'suggest', 'createdAt'],
                },
              },
              {
                resource: { model: dmmf.modelMap.TimeTables, client: prisma },
                options: {
                  navigation: { name: '시간표 관리', icon: 'Time' },
                },
              },
              {
                resource: { model: dmmf.modelMap.TimeTable, client: prisma },
                options: {
                  navigation: { name: '시간표 관리', icon: 'Time' },
                  listProperties: [
                    'TimeTables',
                    'subject',
                    'startTime',
                    'endTime',
                  ],
                },
              },
              {
                resource: { model: dmmf.modelMap.Subject, client: prisma },
                options: {
                  navigation: { name: '시간표 관리', icon: 'Time' },
                  listProperties: ['subject'],
                },
              },
            ],
          },
        };
      },
    }),
    PrismaModule,
    UsersModule,
    ScoresModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    SuggestsModule,
    TimetablesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
