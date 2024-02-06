import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


import { StudentTest } from "../student-tests/student-test.entity";
import { Answer } from "../answers/answer.entity";
import { Question } from "src/questions/question.entity";

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

