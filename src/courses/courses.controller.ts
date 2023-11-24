import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CreateCourseRequest } from './requests/create-course-request';

@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAllCourses() {
        return await this.coursesService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Professor)
    @Post()
    async createCourse(@Body() data: CreateCourseRequest) {
        return await this.coursesService.createCourse(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getTestsForCourse(@Param('id', ParseIntPipe) id: number) {
        return await this.coursesService.findTestsForCourse(id);
    }

    @Put('add-student:id')
    async addStudent(@Param('id', ParseIntPipe) id: number, @Body() email: string) {
        return await this.coursesService.addStudent(id, email);
    }
    @Put('add-professor:id')
    async addProfessor(@Param('id', ParseIntPipe) id: number, @Body() email: string) {
        return await this.coursesService.addProfessor(id, email);
    }
}
