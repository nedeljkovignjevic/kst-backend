import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsService } from './questions.service';
import { Question } from './question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  exports: [QuestionsService],
  providers: [QuestionsService]
})
export class QuestionsModule {}
