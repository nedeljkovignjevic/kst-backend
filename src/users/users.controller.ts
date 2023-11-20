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

    @Post('/')
    async createUser(@Body() data: CreateUserRequest) {
        console.log(data);
        this.userService.createUser(data);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/')
    async getAllUsers() {
        const users = this.userService.getAll();
        return users;
    }

}
