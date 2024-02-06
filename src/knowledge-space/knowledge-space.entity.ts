import { KSTNode } from "src/kst-node/kst-node.entity";
import { KSTRelation } from "src/kst-relation/kst-relation.entity";
import { Test } from "src/tests/test.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class KnowledgeSpace {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Test, (test) => test.knowledgeSpaces)
    test: Test;

    @OneToMany(type => KSTNode, kstNode => kstNode.knowledgeSpace)
    nodes: KSTNode[];

    @OneToMany(type => KSTRelation, kstRelation => kstRelation.knowledgeSpace)
    relations: KSTRelation[];
}

