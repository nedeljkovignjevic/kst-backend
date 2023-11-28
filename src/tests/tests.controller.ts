import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CreateTestRequest } from './requests/create-test-request';

@Controller('tests')
export class TestsController {

    constructor(private testsService: TestsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Professor)
    @Get('/')
    async getTests() {
        return await this.testsService.findAll();
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Professor)
    @Post('/')
    async createTest(@Body() data: CreateTestRequest, @Request() { user }) {

        return await this.testsService.createTest(data, user);
    }


}
