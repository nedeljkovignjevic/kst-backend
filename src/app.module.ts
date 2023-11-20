import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import jwt from './config/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwt],
    }),

    UsersModule, 
    AuthModule
  ],
})
export class AppModule {}
