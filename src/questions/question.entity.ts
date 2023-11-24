import { Test } from "../tests/test.entity";
import { Answer } from "../answers/answer.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    text: string;

    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[];

    @ManyToOne(() => Test, (test) => test.questions)
    test: Test
}

