import { BadRequestException, Injectable } from '@nestjs/common';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseRequest } from './requests/create-course-request';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/auth/roles/role.enum';
import { AddUserToCourseRequest } from './requests/add-user-to-course-request';

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

    async addStudent(data: AddUserToCourseRequest) {
        const course = await this.findCourseByIdWithStudents(data.courseId);

        const user = await this.usersService.findOneActiveByEmail(data.userEmail);
        if (!user) {
            throw new BadRequestException("Invalid email");
        }
        if (!user.roles.includes(Role.Student)) {
            throw new BadRequestException("User is not a student");
        }

        course.students.push(user);
        return this.coursesRepository.save(course);
    }

    async addProfessor(data: AddUserToCourseRequest) {
        const course = await this.findCourseByIdWithProfessors(data.courseId);

        const user = await this.usersService.findOneActiveByEmail(data.userEmail);
        if (!user) {
            throw new BadRequestException("Invalid email");
        }
        if (!user.roles.includes(Role.Professor)) {
            throw new BadRequestException("User is not a professor");
        }

        course.professors.push(user);
        return this.coursesRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        
        return this.coursesRepository.find();
    }

    async findOne(id: number) {
        return this.coursesRepository.findOne({
            where: {
                id,
            }
        });
    }

    async findTestsForCourse(courseId: number) {
        const course = await this.coursesRepository.findOne({
            where: {
                id: courseId,
            },
            relations: ['tests', 'tests.questions', 'tests.questions.answers'],
        })
        if (!course) {
            throw new BadRequestException("Course does not exists");
        }

        return course.tests;
    }

    async findCourseByIdWithStudents(id: number) {
        const course = await this.coursesRepository.findOne({
            where: {
                id,
            },
            relations: ['students'],
        })
        if (!course) {
            throw new BadRequestException("Course does not exists");
        }
        return course;

    }

    private async findCourseByIdWithProfessors(id: number) {
        const course = await this.coursesRepository.findOne({
            where: {
                id,
            },
            relations: ['professors'],
        })
        if (!course) {
            throw new BadRequestException("Course does not exists");
        }
        return course;
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
