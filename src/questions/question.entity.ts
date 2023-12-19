import { Test } from "../tests/test.entity";
import { Answer } from "../answers/answer.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { KSTNode } from "../kst-node/kst-node.entity";

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    text: string;

    @ManyToOne(() => Test, (test) => test.questions)
    test: Test

    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[];

    @ManyToOne(() => KSTNode, (node) => node.questions)
    node: KSTNode
}

