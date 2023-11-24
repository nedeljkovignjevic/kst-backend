import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentTest } from './student-test.entity';
import { CreateStudentTestRequest } from './requests/create-student-test-request';
import { TestsService } from 'src/tests/tests.service';
import { CreateStudentAnswerRequest } from './requests/create-student-answer-request';
import { QuestionsService } from 'src/questions/questions.service';
import { AnswersService } from 'src/answers/answers.service';

@Injectable()
export class StudentTestsService {

    constructor(
        @InjectRepository(StudentTest)
        private studentTestsRepository: Repository<StudentTest>,

        private testsService: TestsService,
        private questionsService: QuestionsService,
        private answersService: AnswersService,
    ) {}

    async createStudentTest(data: CreateStudentTestRequest, authUser) {
        const test = await this.testsService.findOne(data.test_id);
        if (!test) {
            throw new BadRequestException("Test does not exists");
        }

        const studentAnswers = [];
        for (let el of data.studentAnswers) {
            const { question, answer } = await this.checkStudentAnswer(test.id, el);
            studentAnswers.push( {
                test,
                question,
                answer
            } )
        }

        const studentTest = {
            title: data.title,
            test,
            studentAnswers,
            student: authUser
        }

        return this.studentTestsRepository.save(studentTest);
    }

    private async checkStudentAnswer(test_id: number, data: CreateStudentAnswerRequest) {
        const question = await this.questionsService.findOne(data.question_id);
        if (!question) {
            throw new BadRequestException("Question does not exists");
        }
        if (question.test.id !== test_id) {
            throw new BadRequestException("Test and question mismatch");
        }

        const answer = await this.answersService.findOne(data.answer_id);
        if (!answer) {
            throw new BadRequestException("Answer does not exists");
        }
        if (answer.question.id !== question.id) {
            throw new BadRequestException("Question and answer mismatch");
        }

        return { question, answer };
    }


}
