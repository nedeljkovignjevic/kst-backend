import { Injectable } from '@nestjs/common';
import { KnowledgeSpace } from './knowledge-space.entity';
import { KSTNode } from 'src/kst-node/kst-node.entity';
import { CreateKnowledgeSpaceDTO } from './dto/create-knowledge-space.dto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KstNodeService } from 'src/kst-node/kst-node.service';
import { KSTConceptDTO, KnowledgeSpaceDTO } from './dto/knowledge-space.dto.entity';

@Injectable()
export class KnowledgeSpaceService {
    
    constructor(
        @InjectRepository(KnowledgeSpace)
        private knowledgeSpaceRepository: Repository<KnowledgeSpace>,

        private kstNodeService: KstNodeService
    ) {}


    async createKnowledgeSpace(data: CreateKnowledgeSpaceDTO): Promise<KnowledgeSpace> {
        let knowledgeSpace = new KnowledgeSpace();
        
        // This could be updated later
        knowledgeSpace.test = null;
        knowledgeSpace.relations = [];

        knowledgeSpace.nodes = [];
        knowledgeSpace.name = data.graphName;
        knowledgeSpace.description = data.graphDescription;
        knowledgeSpace = await this.knowledgeSpaceRepository.save(knowledgeSpace);

        data.concepts.forEach(c => {
            let node = new KSTNode();

            // This could be updated later
            node.sourceRelations = []
            node.destinationRelations = [];

            node.text = c.concept;
            node.questionLevel = c.questionLevel;
            node.x = c.x;
            node.y = c.y;
            node.questions = [];
            node.knowledgeSpace = knowledgeSpace;
            this.kstNodeService.save(node);
        })

        return this.knowledgeSpaceRepository.findOne({
            where: {
                id: knowledgeSpace.id
              },
        });
    }

    async getAllKnowledgeSpaces(): Promise<KnowledgeSpaceDTO[]> {
        const retVal: KnowledgeSpaceDTO[] = []

        let knowledgeSpaces = await this.knowledgeSpaceRepository.find();
        knowledgeSpaces.forEach(knowledgeSpace => {
            const knowledgeSpaceDTO = new KnowledgeSpaceDTO();
            knowledgeSpaceDTO.id = knowledgeSpace.id;
            knowledgeSpaceDTO.graphName = knowledgeSpace.name;
            knowledgeSpaceDTO.graphDescription = knowledgeSpace.description;

            // Fill nodes
            knowledgeSpaceDTO.concepts = []
            knowledgeSpace.nodes.forEach(node => {
                let conceptDTO = new KSTConceptDTO();
                conceptDTO.key = String(node.id);
                conceptDTO.concept = node.text;
                conceptDTO.questionLevel = node.questionLevel;
                conceptDTO.x = node.x;
                conceptDTO.y = node.y;

                knowledgeSpaceDTO.concepts.push(conceptDTO);
            })

            retVal.push(knowledgeSpaceDTO);
        })

        return retVal;
    }
}
