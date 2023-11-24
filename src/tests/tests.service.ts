import { Injectable } from '@nestjs/common';
import { Test } from './test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TestsService {

    constructor(
        @InjectRepository(Test)
        private testsRepository: Repository<Test>,
    ) {}

    async findOne(id: number): Promise<Test> {
        return this.testsRepository.findOne({
            where: {
              id,
            },
        });
    }
}
