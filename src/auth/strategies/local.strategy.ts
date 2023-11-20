import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UsersService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {

        const user = await this.userService.findOne(email);
        
        if (!user) {
            throw new UnauthorizedException("Invalid email");
        }
        if (user.password !== password) {
            throw new UnauthorizedException("Invalid password");
        }

        return user;
    }
}