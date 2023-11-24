import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from 'class-validator';
import { CreateStudentAnswerRequest } from './create-student-answer-request';

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
