import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../users/user.entity";
import { Test } from "../tests/test.entity";
import { StudentAnswer } from "src/student-answers/student-answer.entity";

@Entity()
export class StudentTest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @ManyToOne(() => User, (user) => user.tests)
    student: User

    @ManyToOne(() => Test, (test) => test.studentTests)
    test: Test

    @OneToMany(type => StudentAnswer, studentAnswer => studentAnswer.studentTest)
    studentAnswers: StudentAnswer[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    startTime: Date;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    endTime: Date;

}

