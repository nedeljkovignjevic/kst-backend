import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


import { StudentTest } from "../student-tests/student-test.entity";
import { Question } from "../questions/question.entity";
import { Answer } from "../answers/answer.entity";

@Entity()
export class StudentAnswer {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentTest, (studentTest) => studentTest.studentAnswers)
    studentTest: StudentTest;

    @OneToOne(() => Question)
    @JoinColumn()
    question: Question;

    @OneToOne(() => Answer)
    @JoinColumn()
    answer: Answer;
}

