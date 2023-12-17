import { BadRequestException, Injectable } from '@nestjs/common';
import { Test } from './test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTestRequest } from './requests/create-test-request.dto';
import { CoursesService } from 'src/courses/courses.service';
import { AnswersService } from 'src/answers/answers.service';
import { Question } from 'src/questions/question.entity';
import { Answer } from 'src/answers/answer.entity';

import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class TestsService {

    constructor(
        @InjectRepository(Test)
        private testsRepository: Repository<Test>,

        private coursesService: CoursesService,
        private questionsService: QuestionsService,
        private answersService: AnswersService
    ) {}

    async findOne(id: number): Promise<Test> {
        return this.testsRepository.findOne({
            where: {
              id,
            },
        });
    }

    async findOneWithQuestions(id: number): Promise<Test> {
        const test = await this.testsRepository.findOne({
            relations: ['questions', 'questions.answers'],
            where: {
              id,
            },
        });

        if (!test) {
            throw new BadRequestException("Test id does not exists");
        }

        return test;
    }
 
    async findAll() {
        return this.testsRepository.find({
            relations: ['questions', 'questions.answers']
        });
    }

    async findTestsForCourse(courseId: number) {
        return this.testsRepository.find({
            relations: ['course', 'questions', 'questions.answers'],
            where: {
                course: {
                    id: courseId,
                },
            },
        });
    }

    async createTest(data: CreateTestRequest, authUser) {
        const course = await this.coursesService.findOne(data.courseId);
        if (!course) {
            throw new BadRequestException("Course id not valid");
        }

        const createdTest = await this.testsRepository.save({
            course: course,
            title: data.title,
            createdById: authUser.id,
        });

        await data.questions.forEach(async questionDTO => {
            const q = new Question();
            q.test = createdTest;
            q.text = questionDTO.text;
            const createdQuestion = await this.questionsService.save(q);

            questionDTO.answers.forEach(async answerDTO => {
                const a = new Answer();
                a.question = createdQuestion,
                a.text = answerDTO.text
                a.correct = answerDTO.correct,
                await this.answersService.save(a);
            })
        })

    }

    
}
