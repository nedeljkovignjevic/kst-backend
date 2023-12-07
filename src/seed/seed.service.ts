import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/roles/role.enum';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Course } from 'src/courses/course.entity';


@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
      ) {}
    
      async seed() {

        // Check if already seeded
        const checkedUsers = await this.userRepository.find();
        if (checkedUsers) {
            return;
        }

        const users: Partial<User>[] = [
            { firstname: "Admin", lastname: "Admin", email: "admin@gmail.com", password: await bcrypt.hash("admin123", 10), roles: [Role.Admin] },
            { firstname: "Dragan", lastname: "Draganovic", email: "dragan@gmail.com", password: await bcrypt.hash("dragan123", 10), roles: [Role.Professor] },
            { firstname: "Marko", lastname: "Markovic", email: "marko@gmail.com", password: await bcrypt.hash("marko123", 10), roles: [Role.Student] },
            { firstname: "Darko", lastname: "Darkovic", email: "darko@gmail.com", password: await bcrypt.hash("darko123", 10), roles: [Role.Student] },
        ];

        await this.userRepository.save(users);

        const courses = [
            { title: "Osnove programiranja" },
            { title: "Objektno orjentisano programiranje" }
        ] 

        await this.courseRepository.save(courses);

        // Add professor to courses
        const professor = await this.userRepository.findOne({
            where: {
                email: "dragan@gmail.com"
            }
        })
        const osnoveProgramiranja = await this.courseRepository.findOne({
            where: {
                title: "Osnove programiranja",
            },
            relations: ["professors", "students"],
        });
        const objektno = await this.courseRepository.findOne({
            where: {
                title: "Objektno orjentisano programiranje",
            },
            relations: ["professors", "students"],
        });
        osnoveProgramiranja.professors.push(professor);
        objektno.professors.push(professor);

        // Add students to course Osnove programiranja
        const marko = await this.userRepository.findOne({
            where: {
                email: "marko@gmail.com"
            }
        })
        const darko = await this.userRepository.findOne({
            where: {
                email: "darko@gmail.com"
            }
        })
        osnoveProgramiranja.students.push(marko);
        osnoveProgramiranja.students.push(darko);

        await this.courseRepository.save([
            osnoveProgramiranja,
            objektno
        ]);
    }
}
