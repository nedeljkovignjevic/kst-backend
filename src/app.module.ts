import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import jwt from './config/jwt';
import db from './config/db';

import { GalleriesModule } from './galleries/galleries.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwt, db],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
        useFactory: (configService: ConfigService) => 
        configService.get('db'),
      inject: [ConfigService],
    }),

    UsersModule, 
    AuthModule, 
    GalleriesModule, CommentsModule
  ],
})
export class AppModule {}
