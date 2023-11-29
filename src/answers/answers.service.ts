import { Injectable } from '@nestjs/common';
import { Answer } from './answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/questions/question.entity';

@Injectable()
export class AnswersService {

    constructor(
        @InjectRepository(Answer)
        private answersRepository: Repository<Answer>,
    ) {}

    async findOne(id: number): Promise<Answer> {
        return this.answersRepository.findOne({
            where: {
              id,
            },
        });
    }

    async findOneWithQuestion(id: number): Promise<Answer> {
        return this.answersRepository.findOne({
            relations: {
                question: true,
            },
            where: {
              id,
            },
        });
    }

    async save(answer: Answer) {
        return this.answersRepository.save(answer);
    }

}


