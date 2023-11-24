import { BadRequestException, Injectable } from '@nestjs/common';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) {}

    async findAll(): Promise<Course[]> {

        return this.coursesRepository.find();
    }

    async findTestsForCourse(id: number) {
        const course = await this.coursesRepository.findOne({
            where: {
                id
            }
        })

        if (!course) {
            throw new BadRequestException("Course does not exists");
        }

        return course.tests;
    }

}
