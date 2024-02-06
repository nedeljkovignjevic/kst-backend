import { BadRequestException, Injectable } from '@nestjs/common';
import { Test } from './test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestDTO } from './dto/create-test.dto';
import { CoursesService } from 'src/courses/courses.service';
import { AnswersService } from 'src/answers/answers.service';
import { Answer } from 'src/answers/answer.entity';

import { QuestionsService } from 'src/questions/questions.service';
import { Question } from 'src/questions/question.entity';
import { KstNodeService } from 'src/kst-node/kst-node.service';
import { KnowledgeSpaceService } from 'src/knowledge-space/knowledge-space.service';


@Injectable()
export class TestsService {

    constructor(
        @InjectRepository(Test)
        private testsRepository: Repository<Test>,

        private coursesService: CoursesService,
        private questionsService: QuestionsService,
        private answersService: AnswersService,
        private kstNodeService: KstNodeService,

        private knowledgeSpaceService: KnowledgeSpaceService
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

    async createTest(data: CreateTestDTO) {
        const course = await this.coursesService.findOne(data.courseId);
        if (!course) {
            throw new BadRequestException("Course id not valid");
        }

        const knowledgeSpace = await this.knowledgeSpaceService.findOneById(data.knowledgeSpaceId);
        if (!knowledgeSpace) {
            throw new BadRequestException("Knowledge Space id not valid");
        }
        
        const createdTest = await this.testsRepository.save({
            course: course,
            title: data.testName,
            createdById: 1,

            // This should be updated
            knowledgeSpaces: []
        })

        knowledgeSpace.test = createdTest;
        await this.knowledgeSpaceService.save(knowledgeSpace);


        data.questions.forEach(async questionDTO => {
            const q = new Question();
            q.test = createdTest;
            q.text = questionDTO.question;
            q.node = await this.kstNodeService.findOneById(questionDTO.nodeId);
        
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
