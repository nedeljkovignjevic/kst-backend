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
import { KnowledgeSpace } from 'src/knowledge-space/knowledge-space.entity';
import { KSTNode } from 'src/kst-node/kst-node.entity';
import { v4 as uuidv4 } from 'uuid';
import { KstNodeModule } from 'src/kst-node/kst-node.module';
import { KnowledgeSpaceService } from 'src/knowledge-space/knowledge-space.service';
import { KstNodeService } from 'src/kst-node/kst-node.service';
import { KstRelationModule } from 'src/kst-relation/kst-relation.module';
import { KstRelationService } from 'src/kst-relation/kst-relation.service';
import { KSTRelation } from 'src/kst-relation/kst-relation.entity';


@Injectable()
export class StudentTestsService {

    constructor(
        @InjectRepository(StudentTest)
        private studentTestsRepository: Repository<StudentTest>,

        private testsService: TestsService,
        private questionsService: QuestionsService,
        private answersService: AnswersService,
        private knowledgeSpaceService: KnowledgeSpaceService,
        private kstNodeService: KstNodeService,
        private kstRelationService: KstRelationService,

        private httpService: HttpService
    ) {}

    async getAllStudentTests() {
        let studentTests = await this.studentTestsRepository.find({
            relations: ['test', 'test.questions', 'test.questions.answers', 'student']
        });

        return studentTests;
    }

    async getStudentTestById(id: number) {
        let studentTest = await this.studentTestsRepository.findOne({
            relations: ['test', 'test.questions', 'test.questions.answers', 'student', 'studentAnswers', 'studentAnswers.question', 'studentAnswers.answer', 'test.knowledgeSpaces',
                        'test.knowledgeSpaces.nodes', 'test.knowledgeSpaces.relations', 'studentAnswers.question.node'],
            where: {
                id,
              },
        });

        return studentTest;
    }

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

        const numberOfNodes = studentTests.at(0).studentAnswers.length;
        const data = {};
        studentTests.forEach(studentTest => {
            const answers = studentTest.studentAnswers.map(studentAnswer => Number(studentAnswer.answer.correct));
            data[studentTest.student.email] = answers;
        });

        // send data to iita endpoint
        const headers = { 'Content-Type': 'application/json' };
        try {
            const iitaResponseData = await lastValueFrom(
                this.httpService.post('http://192.168.1.9:5000/iita', JSON.stringify(data), { headers })
                .pipe(map(res => res.data))
            );

            let knowledgeSpace = new KnowledgeSpace();
            knowledgeSpace.name = "EKG for" + String(studentTests[0].test.title);
            knowledgeSpace.test = studentTests[0].test
            this.knowledgeSpaceService.save(knowledgeSpace);    

            // Create KSTNodes
            let nodes = [];
            for (let i = 0; i < numberOfNodes; i++) {
                let node = new KSTNode();
                node.key = uuidv4();
                node.knowledgeSpace = knowledgeSpace;
                node.text = String(i);
                node.x = 50;
                node.y = 50;
                nodes.push(node);
                await this.kstNodeService.save(node);
            }

            // For links (kst-relations) first eliminate repeating pairs
            // [[0, 1], [1, 0], [0, 2], [0, 3]] -> [[0, 2], [0, 3]]
            console.log(iitaResponseData["implications"]);
            const implications = this.eliminateRepeatingPairs(iitaResponseData["implications"]);
            console.log(implications);
            // Create KSTRelations
            await Promise.all(implications.map(async (implication) => {
                const relation = new KSTRelation();
                relation.knowledgeSpace = knowledgeSpace;
                relation.source = nodes[implication[0]].key;
                relation.target = nodes[implication[1]].key;
                await this.kstRelationService.save(relation);
            }));
            
        } catch (error) {
            console.error('Error connecting to Flask API:', error);
        }
    }

    private eliminateRepeatingPairs(input: number[][]): number[][] {
        const result: { [key: string]: boolean } = {};
    
        for (const pair of input) {
            const key = pair.join(',');
            const reversedKey = pair.slice().reverse().join(',');

            // Check if the pair or its reverse has been seen before
            if (!result[key] && !result[reversedKey]) {
                result[key] = true;
            } else {
                if (key in result) 
                    delete result[key];
                if (reversedKey in result)
                    delete result[reversedKey];     
            }
        }
    
        const resultList: number[][] = Object.keys(result).map(key => {
            const [first, second] = key.split(',').map(Number);
            return [first, second];
        });

        return resultList;
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
