import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import jwt from './config/jwt';
import db from './config/db';

import { TestsModule } from './tests/tests.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { StudentTestsModule } from './student-tests/student-tests.module';
import { StudentAnswersModule } from './student-answers/student-answers.module';
import { CoursesModule } from './courses/courses.module';


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
    CoursesModule,
    TestsModule, 
    QuestionsModule, 
    AnswersModule, 
    StudentTestsModule, 
    StudentAnswersModule
  ],
})
export class AppModule {}
