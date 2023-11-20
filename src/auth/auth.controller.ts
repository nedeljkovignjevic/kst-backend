import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request as Req } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: Req) {
        const user = req.user as User;
        const payload = {
            ...user,
            sub: user.email,
        };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Request() req: Req) {
        return this.userService.findOne((req.user as any).email)
    }


}
