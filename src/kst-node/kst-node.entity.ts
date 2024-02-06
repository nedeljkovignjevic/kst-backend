import { KSTRelation } from "src/kst-relation/kst-relation.entity";
import { Question } from "../questions/question.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { KnowledgeSpace } from "src/knowledge-space/knowledge-space.entity";

@Entity()
export class KSTNode {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    text: string;

    @Column({ nullable: false })
    x: number;

    @Column({ nullable: false })
    y: number;

    @Column({ nullable: false })
    questionLevel: number;

    @OneToMany(type => Question, question => question.node)
    questions: Question[];

    @OneToMany(type => KSTRelation, relation => relation.source)
    sourceRelations: KSTRelation[];

    @OneToMany(type => KSTRelation, relation => relation.destination)
    destinationRelations: KSTRelation[];

    @ManyToOne(() => KnowledgeSpace, (knowledgeSpace) => knowledgeSpace.nodes)
    knowledgeSpace: KnowledgeSpace;
}

