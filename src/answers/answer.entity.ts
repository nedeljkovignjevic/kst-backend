import { Question } from "../questions/question.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    text: string;

    @Column({ nullable: false, type: 'boolean' })
    correct: boolean;

    @ManyToOne(() => Question, (question) => question.answers)
    question: Question
}

