import { Module } from '@nestjs/common';
import { StudentTestsService } from './student-tests.service';
import { StudentTestsController } from './student-tests.controller';
import { TestsModule } from 'src/tests/tests.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { StudentTest } from './student-test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [TypeOrmModule.forFeature([StudentTest]), TestsModule, QuestionsModule, AnswersModule, HttpModule],
  providers: [StudentTestsService],
  controllers: [StudentTestsController]
})
export class StudentTestsModule {}
