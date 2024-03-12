import { KSTRelation } from "src/kst-relation/kst-relation.entity";
import { Question } from "../questions/question.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { KnowledgeSpace } from "src/knowledge-space/knowledge-space.entity";

@Entity()
export class KSTNode {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    key: string;

    @Column({ nullable: false })
    text: string;

    @Column('decimal', { precision: 6, scale: 2 })
    x: number;

    @Column('decimal', { precision: 6, scale: 2 })
    y: number;

    @OneToMany(type => Question, question => question.node)
    questions: Question[];

    @ManyToOne(() => KnowledgeSpace, (knowledgeSpace) => knowledgeSpace.nodes)
    knowledgeSpace: KnowledgeSpace;
}

