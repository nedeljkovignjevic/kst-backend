import { KSTRelation } from "src/kst-relation/kst-relation.entity";
import { Test } from "src/tests/test.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class KnowledgeSpace {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Test, (test) => test.knowledgeSpaces)
    test: Test;

    @OneToMany(type => KSTRelation, kstRelation => kstRelation.knowledgeSpace)
    relations: KSTRelation[];
}

