import { BadRequestException, Injectable } from '@nestjs/common';
import { KnowledgeSpace } from './knowledge-space.entity';
import { KSTNode } from 'src/kst-node/kst-node.entity';
import { CreateKnowledgeSpaceDTO } from './dto/create-knowledge-space.dto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KstNodeService } from 'src/kst-node/kst-node.service';
import { KSTConceptDTO, KSTRelationDTO, KnowledgeSpaceDTO } from './dto/knowledge-space.dto.entity';
import { KSTRelation } from 'src/kst-relation/kst-relation.entity';
import { KstRelationService } from 'src/kst-relation/kst-relation.service';

@Injectable()
export class KnowledgeSpaceService {
    
    constructor(
        @InjectRepository(KnowledgeSpace)
        private knowledgeSpaceRepository: Repository<KnowledgeSpace>,

        private kstNodeService: KstNodeService,
        private kstRelationService: KstRelationService

    ) {}

    async findOneById(id: number) {
        let ks = await this.knowledgeSpaceRepository.findOne({
            relations: ['test'],
            where: {
                id
            }
        })

        if (!ks) {
            throw new BadRequestException("Knowledge Space id not valid");
        }

        return ks;
    }

    async save(knowledgeSpace: KnowledgeSpace) {
        
        return await this.knowledgeSpaceRepository.save(knowledgeSpace);
    }

    async createKnowledgeSpace(data: CreateKnowledgeSpaceDTO): Promise<KnowledgeSpace> {
        let knowledgeSpace = new KnowledgeSpace();
        
        // This could be updated later
        knowledgeSpace.test = null;
        knowledgeSpace.relations = [];

        knowledgeSpace.nodes = [];
        knowledgeSpace.relations = [];
        knowledgeSpace.name = data.graphName;
        knowledgeSpace.description = data.graphDescription;
        knowledgeSpace = await this.knowledgeSpaceRepository.save(knowledgeSpace);
        
        data.concepts.forEach(c => {
            let node = new KSTNode();
            node.text = c.concept;
            node.x = c.x;
            node.y = c.y;
            node.questions = [];
            node.knowledgeSpace = knowledgeSpace;
            this.kstNodeService.save(node);
        })

        data.links.forEach(l => {
            let relation = new KSTRelation();
            relation.source = l.source;
            relation.target = l.target;
            relation.knowledgeSpace = knowledgeSpace;
            this.kstRelationService.save(relation);
        })

        return this.knowledgeSpaceRepository.findOne({
            where: {
                id: knowledgeSpace.id
              },
        });
    }

    async getAllKnowledgeSpaces(): Promise<KnowledgeSpaceDTO[]> {
        const retVal: KnowledgeSpaceDTO[] = []

        let knowledgeSpaces = await this.knowledgeSpaceRepository.find({
            relations: ['nodes', 'relations']
        });

        knowledgeSpaces.forEach(knowledgeSpace => {
            const knowledgeSpaceDTO = new KnowledgeSpaceDTO();
            knowledgeSpaceDTO.id = knowledgeSpace.id;
            knowledgeSpaceDTO.graphName = knowledgeSpace.name;
            knowledgeSpaceDTO.graphDescription = knowledgeSpace.description;

            // Fill nodes
            knowledgeSpaceDTO.concepts = []
            knowledgeSpace.nodes.forEach(node => {
                let conceptDTO = new KSTConceptDTO();
                conceptDTO.id = node.id;
                conceptDTO.key = node.key;
                conceptDTO.concept = node.text;
                conceptDTO.x = node.x;
                conceptDTO.y = node.y;

                knowledgeSpaceDTO.concepts.push(conceptDTO);
            })

            // Fill relations
            knowledgeSpaceDTO.links = []
            knowledgeSpace.relations.forEach(relation => {
                let relationDTO = new KSTRelationDTO();
                relationDTO.id = relation.id;
                relationDTO.source = relation.source;
                relationDTO.target = relation.target;

                knowledgeSpaceDTO.links.push(relationDTO);
            })

            retVal.push(knowledgeSpaceDTO);
        })

        return retVal;
    }
}
