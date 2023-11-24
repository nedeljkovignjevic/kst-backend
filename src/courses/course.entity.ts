import { Test } from "../tests/test.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @OneToMany(type => Test, test => test.course)
    tests: Test[];

    @Column({ type: 'boolean', default: 1 })
    isActive: boolean;
}

