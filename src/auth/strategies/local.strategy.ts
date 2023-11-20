import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UsersService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, plainPassword: string): Promise<any> {
        const user = await this.userService.findOneActiveByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException("Invalid email");
        }
        if (!await bcrypt.compare(plainPassword, user.password)) {
            throw new UnauthorizedException("Invalid password");
        }

        const { password, ...userWithoutPass } = user
        return userWithoutPass;
    }
}