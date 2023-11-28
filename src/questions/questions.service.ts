import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {

    constructor(
        @InjectRepository(Question)
        private questionsRepository: Repository<Question>,
    ) {}

    async findOne(id: number): Promise<Question> {
        return this.questionsRepository.findOne({
            where: {
              id,
            },
        });
    }

    async save(question: Question): Promise<Question> {
        return this.questionsRepository.save(question);
    }
}
