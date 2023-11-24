import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../auth/roles/role.enum";

import { IsEnum } from "class-validator";
import { StudentTest } from "../student-tests/student-test.entity";

@Entity({name: "users"})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    firstname: string;
    
    @Column({ nullable: false })
    lastname: string;
    
    @Column({ unique: true })
    email: string;
    
    @Column({ nullable: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.Student })
    @IsEnum(Role, { each: true })     
    roles: Role[];

    @OneToMany(type => StudentTest, studentTest => studentTest.student)
    tests: StudentTest[];

    @Column({ type: 'boolean', default: 1 })
    isActive: boolean;
}

