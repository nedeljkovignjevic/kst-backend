import { BadRequestException, Injectable } from '@nestjs/common';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseRequest } from './requests/create-course-request';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/auth/roles/role.enum';

@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,

        private usersService: UsersService,
    ) {}

    async createCourse(data: CreateCourseRequest) {
        return this.coursesRepository.save(data);
    }

    async addStudent(id: number, email: string) {
        const course = await this.checkIfCourseExists(id);

        const user = await this.usersService.findOneActiveByEmail(email);
        if (!user) {
            throw new BadRequestException("Invalid email");
        }
        if (!user.roles.includes(Role.Student)) {
            throw new BadRequestException("User is not a student");
        }

        course.students.push(user);
        return this.coursesRepository.save(course);
    }

    async addProfessor(id: number, email: string) {
        const course = await this.checkIfCourseExists(id);

        const user = await this.usersService.findOneActiveByEmail(email);
        if (!user) {
            throw new BadRequestException("Invalid email");
        }
        if (!user.roles.includes(Role.Professor)) {
            throw new BadRequestException("User is not a professor");
        }

        course.proffesors.push(user);
        return this.coursesRepository.save(course);
    }

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

    private async checkIfCourseExists(id: number) {
        const course = await this.coursesRepository.findOne( {
            where: {
                id,
            }
        })
        if (!course) {
            throw new BadRequestException("Course does not exists");
        }
        return course;
    }
}
