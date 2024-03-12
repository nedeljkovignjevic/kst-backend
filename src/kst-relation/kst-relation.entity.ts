import { IsString } from "class-validator";
import { KnowledgeSpace } from "src/knowledge-space/knowledge-space.entity";
import { KSTNode } from "src/kst-node/kst-node.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class KSTRelation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    source: string;

    @Column({ nullable: false })
    target: string;

    @ManyToOne(() => KnowledgeSpace, (knowledgeSpace) => knowledgeSpace.relations)
    knowledgeSpace: KnowledgeSpace;
}

