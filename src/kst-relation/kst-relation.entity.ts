import { KnowledgeSpace } from "src/knowledge-space/knowledge-space.entity";
import { KSTNode } from "src/kst-node/kst-node.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class KSTRelation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => KSTNode, (node) => node.sourceRelations)
    source: KSTNode;

    @ManyToOne(() => KSTNode, (node) => node.destinationRelations)
    destination: KSTNode;

    @ManyToOne(() => KnowledgeSpace, (knowledgeSpace) => knowledgeSpace.relations)
    knowledgeSpace: KnowledgeSpace;
}
