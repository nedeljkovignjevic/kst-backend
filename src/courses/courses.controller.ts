import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CreateCourseRequest } from './requests/create-course-request';
import { AddUserToCourseRequest } from './requests/add-user-to-course-request';

@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/')
    async getAllCourses() {
        return await this.coursesService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('/')
    async createCourse(@Body() data: CreateCourseRequest) {
        return await this.coursesService.createCourse(data);
    }

    @Put('/add-student')
    async addStudent(@Body() data: AddUserToCourseRequest) {
        return await this.coursesService.addStudent(data);
    }
    @Put('/add-professor')
    async addProfessor(@Body() data: AddUserToCourseRequest) {
        return await this.coursesService.addProfessor(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:id')
    async getTestsForCourse(@Param('id', ParseIntPipe) id: number) {
        return await this.coursesService.findTestsForCourse(id);
    }
}
