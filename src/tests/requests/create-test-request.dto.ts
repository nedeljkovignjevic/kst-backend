import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Answer } from 'src/answers/answer.entity';
import { Question } from 'src/questions/question.entity';

class AnswerDTO {

    @IsString()
    @IsNotEmpty()
    text: string;


    @IsBoolean()
    @IsNotEmpty()
    correct: boolean;
}

class QuestionDTO {

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    answers: AnswerDTO[];
}

export class CreateTestRequest {

    @IsNumber()
    @IsNotEmpty()
    courseId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    questions: QuestionDTO[]
}