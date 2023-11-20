import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { Role } from '../auth/roles/role.enum';
import { CreateUserRequest } from './requests/create-user-request';

const user1 = new User("Marko", "Markovic", "mare@email.com", "maremdma"); user1.roles = [Role.User];
const user2 = new User("Darko", "Darkovic", "dare@email.com", "dare123"); user2.roles = [Role.User];
const user3 = new User("Admin", "Admin", "admin@email.com", "adminadmin"); user3.roles = [Role.Admin];

const users: User[] = [user1, user2, user3];
                        

@Injectable()
export class UsersService {

    getAll() {
        return users;
    }

    findOne(email: string) {
        const existingUser = users.find(user => user.email === email)
        // if (!existingUser) {
        //     throw new BadRequestException('User with this email does not exists');
        // }
        return existingUser;
    } 


    createUser(data: CreateUserRequest) {
        users.push(new User(data.firstname, data.lastname, data.email, data.password))
    }

    checkEmail({ id, email }: { id?: number; email?: string }) {
        const existingUser = users.find(user => user.email === email);
        if (!existingUser) {
            throw new BadRequestException('Email already in use');
        }
    }

}
