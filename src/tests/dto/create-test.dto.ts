import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
    question: string;

    @IsNotEmpty()
    answers: AnswerDTO[];

    @IsNumber()
    @IsNotEmpty()
    nodeId: number
}

export class CreateTestDTO {

    @IsNumber()
    @IsNotEmpty()
    courseId: number;

    @IsNumber()
    @IsNotEmpty()
    knowledgeSpaceId: number;

    @IsString()
    @IsNotEmpty()
    testName: string;

    @IsNotEmpty()
    questions: QuestionDTO[]
}