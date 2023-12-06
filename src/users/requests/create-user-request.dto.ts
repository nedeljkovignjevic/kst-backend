import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength, NotContains, NotEquals } from 'class-validator';
import { defaultIfEmpty } from 'rxjs';
import { Role } from 'src/auth/roles/role.enum';

export class CreateUserRequest {
    
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/.*\d.*/, { message: 'Password must contain at least one digit' })
    password: string;

    @IsEnum(Role, { each: true } )
    @NotEquals(Role.Admin, { each: true })
    roles: Role[];
}
