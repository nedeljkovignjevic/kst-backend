import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { SeedService } from './seed.service';
import { Course } from 'src/courses/course.entity';


@Module({
    imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Course])],
    providers: [SeedService],
})
export class SeedModule {}
