import { User } from "src/users/user.entity";
import { Test } from "../tests/test.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    title: string;

    @OneToMany(type => Test, test => test.course)
    tests: Test[];

    @ManyToMany(() => User)
    @JoinTable()
    students: User[]

    @ManyToMany(() => User)
    @JoinTable()
    professors: User[]

    @Column({ type: 'boolean', default: 1 })
    isActive: boolean;
}

