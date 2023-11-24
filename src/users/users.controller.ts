import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './requests/create-user-request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('/')
    async createUser(@Body() data: CreateUserRequest) {

        this.userService.createUser(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/')
    async getAllUsers() {
        return this.userService.findAll(true);
    }



}
