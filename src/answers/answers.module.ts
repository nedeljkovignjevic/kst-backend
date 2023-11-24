import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  exports: [AnswersService],
  providers: [AnswersService]
})
export class AnswersModule {}
