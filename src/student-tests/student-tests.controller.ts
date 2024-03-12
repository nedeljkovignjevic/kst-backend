import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { StudentTestsService } from './student-tests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreateStudentTestRequest } from './requests/create-student-test-request.dto';

@Controller('student-tests')
export class StudentTestsController {


    constructor(private studentTestsService: StudentTestsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Student)
    @Post()
    async createStudentTest(@Body() data: CreateStudentTestRequest, @Request() { user }) {

        return await this.studentTestsService.createStudentTest(data, user);
    }

    @Get('/')
    async getStudentTests() {
       
        return await this.studentTestsService.getAllStudentTests();
    }


    @Post('/iita/:id')
    async iita(@Param('id', ParseIntPipe) id: number) {

        return await this.studentTestsService.iitaOnStudentTest(id);
    }

}
