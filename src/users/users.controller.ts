import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './requests/create-user-request.dto';
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

        return await this.userService.createUser(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/')
    async getAllUsers() {
        return await this.userService.findAll(true);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:id')
    async getOneUser(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.findOne(id);
    }
    
}
