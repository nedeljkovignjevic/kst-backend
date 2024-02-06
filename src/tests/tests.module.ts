import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from './test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsController } from './tests.controller';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { CoursesModule } from 'src/courses/courses.module';
import { KstNodeModule } from 'src/kst-node/kst-node.module';

@Module({
  imports: [TypeOrmModule.forFeature([Test]), QuestionsModule, AnswersModule, CoursesModule, KstNodeModule],
  providers: [TestsService],
  exports: [TestsService],
  controllers: [TestsController]
})
export class TestsModule {}
