import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAllCourses() {
        return await this.coursesService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getTestsForCourse(@Param('id', ParseIntPipe) id: number) {
        return await this.coursesService.findTestsForCourse(id);
    }

}
