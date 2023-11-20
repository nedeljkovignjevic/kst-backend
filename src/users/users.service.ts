import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserRequest } from './requests/create-user-request';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createUser(data: CreateUserRequest): Promise<User> {
        await this.checkEmail(data.email)

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userData = {
            ...data,
            password: hashedPassword,
        }
        const userEntity = await this.usersRepository.save(userData);
        return userEntity
    }

    async findAll(isActive?: boolean): Promise<User[]> {
        if (isActive) {
            return this.usersRepository.find({
                where: {
                    isActive,
                },
            });
        }

        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({
            where: {
              id,
            },
        });
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({
            where: {
              email,
            },
        });
    }

    async findOneActive(id: number): Promise<User> {
        return this.usersRepository.findOne({
            where: {
              id,
              isActive: true,
            },
        });
    }

    async findOneActiveByEmail(email: string): Promise<User> {
        return this.usersRepository.findOneBy({
            email,
            isActive: true,
        });
    }

    async checkEmail(email: string) {
        // check if email is free
        const existingUser = await this.findOneByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }
    }

}
