import { Question } from "../questions/question.entity";
import { Course } from "../courses/course.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StudentTest } from "src/student-tests/student-test.entity";

@Entity()
export class Test {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @ManyToOne(() => Course, (course) => course.tests)
    course: Course

    @OneToMany(type => Question, question => question.test)
    questions: Question[];

    @OneToMany(type => StudentTest, studentTest => studentTest.test)
    studentTests: StudentTest[];

    @Column()
    createdById: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
}

