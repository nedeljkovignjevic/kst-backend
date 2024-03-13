import { Module } from '@nestjs/common';
import { StudentTestsService } from './student-tests.service';
import { StudentTestsController } from './student-tests.controller';
import { TestsModule } from 'src/tests/tests.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { StudentTest } from './student-test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { KnowledgeSpaceModule } from 'src/knowledge-space/knowledge-space.module';
import { KstNodeModule } from 'src/kst-node/kst-node.module';
import { KstRelationModule } from 'src/kst-relation/kst-relation.module';


@Module({
  imports: [TypeOrmModule.forFeature([StudentTest]), TestsModule, QuestionsModule, AnswersModule, HttpModule, KnowledgeSpaceModule, KstNodeModule, KstRelationModule],
  providers: [StudentTestsService],
  controllers: [StudentTestsController]
})
export class StudentTestsModule {}
