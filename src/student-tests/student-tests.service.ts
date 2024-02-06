import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentTest } from './student-test.entity';
import { CreateStudentAnswerRequest, CreateStudentTestRequest } from './requests/create-student-test-request.dto';
import { TestsService } from 'src/tests/tests.service';
import { QuestionsService } from 'src/questions/questions.service';
import { AnswersService } from 'src/answers/answers.service';
import { Test } from 'src/tests/test.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';


@Injectable()
export class StudentTestsService {

    constructor(
        @InjectRepository(StudentTest)
        private studentTestsRepository: Repository<StudentTest>,

        private testsService: TestsService,
        private questionsService: QuestionsService,
        private answersService: AnswersService,

        private httpService: HttpService
    ) {}

    async createStudentTest(data: CreateStudentTestRequest, authUser) {
        const test = await this.testsService.findOneWithQuestions(data.test_id);
        if (!test) {
            throw new BadRequestException("Test does not exists");
        }

        await this.checkIfAllQuestionsAnswered(test, data);

        const studentAnswers = await Promise.all(data.studentAnswers.map(async (answerRequest) => {
            const { question, answer } = await this.checkStudentAnswer(test.id, answerRequest);
            return {
                test,
                question,
                answer
            };
        }));

        const studentTest = {
            title: data.title,
            test: test,
            studentAnswers: studentAnswers,
            student: authUser
        }

        return this.studentTestsRepository.save(studentTest);
    }

    async iitaOnStudentTest(test_id: number) {
        let studentTests = await this.studentTestsRepository.find({
            relations: ['test', 'student', 'studentAnswers', 'studentAnswers.question', 'studentAnswers.answer'],
            where: {
                test: {
                    id: test_id,
                },
            },
        })

        const data = {};
        studentTests.forEach(studentTest => {
            const answers = studentTest.studentAnswers.map(studentAnswer => Number(studentAnswer.answer.correct));
            data[studentTest.student.email] = answers;
        });

        // send data to iita endpoint
        const headers = { 'Content-Type': 'application/json' };
    
        console.log("sti lud?");
        try {
            const iitaResponseData = await lastValueFrom(
                this.httpService.post('http://127.0.0.1:5000/iita/', data, { headers })
                .pipe(map(res => res.data))
            );
            console.log('Response from Flask API:', iitaResponseData);
        } catch (error) {
            console.error('Error connecting to Flask API:', error);
        }

        return;
    }

    private async checkStudentAnswer(test_id: number, data: CreateStudentAnswerRequest) {
        const question = await this.questionsService.findOneWithTest(data.question_id);

        if (!question) {
            throw new BadRequestException("Question does not exists");
        }
        if (question.test.id !== test_id) {
            throw new BadRequestException("Test and question mismatch");
        }

        const answer = await this.answersService.findOneWithQuestion(data.answer_id);
        if (!answer) {
            throw new BadRequestException("Answer does not exists");
        }
        if (answer.question.id !== question.id) {
            throw new BadRequestException("Question and answer mismatch");
        }

        return { question, answer };
    }

    private async checkIfAllQuestionsAnswered(test: Test, data: CreateStudentTestRequest) {
        const questionIds: number[] = data.studentAnswers.map(a => a.question_id);
        const allQuestionsAnswered = test.questions.every(q => questionIds.includes(q.id));

        if (!allQuestionsAnswered) {
            throw new BadRequestException("All questions from test should be answered");
        }

    }
}
