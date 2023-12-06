import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from 'class-validator';

export class CreateStudentAnswerRequest {
    
    @IsNumber()
    @IsNotEmpty()
    question_id: number;

    @IsNumber()
    @IsNotEmpty()
    answer_id: number;
}

export class CreateStudentTestRequest {
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    studentAnswers: CreateStudentAnswerRequest[];

    @IsNumber()
    @IsNotEmpty()
    test_id: number;
}
