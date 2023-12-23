import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAnswer } from './student-answer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StudentAnswer])],
})
export class StudentAnswersModule {}
