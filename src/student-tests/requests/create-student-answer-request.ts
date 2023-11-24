import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from 'class-validator';

export class CreateStudentAnswerRequest {
    
    @IsNumber()
    @IsNotEmpty()
    question_id: number;

    @IsNumber()
    @IsNotEmpty()
    answer_id: number;
}
