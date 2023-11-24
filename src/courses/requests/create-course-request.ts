import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseRequest {
    
    @IsString()
    @IsNotEmpty()
    title: string;
}
