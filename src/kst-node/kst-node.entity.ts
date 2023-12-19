import { KSTRelation } from "src/kst-relation/kst-relation.entity";
import { Question } from "../questions/question.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(type => Question, question => question.node)
    questions: Question[];

    @OneToMany(type => KSTRelation, relation => relation.source)
    sourceRelations: KSTRelation[];

    @OneToMany(type => KSTRelation, relation => relation.destination)
    destinationRelations: KSTRelation[];
}

