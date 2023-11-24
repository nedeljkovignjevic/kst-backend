import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddUserToCourseRequest {

    @IsNumber()
    @IsNotEmpty()
    courseId: number;

    @IsString()
    @IsNotEmpty()
    userEmail: string;
}
