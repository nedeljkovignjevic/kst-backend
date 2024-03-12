import { BadRequestException, Injectable } from '@nestjs/common';
import { KSTRelation } from './kst-relation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KstRelationService {
    constructor(
        @InjectRepository(KSTRelation)
        private kstRelationRepository: Repository<KSTRelation>,
    ) {}

    async findOneById(id: number) {
        let relation = await this.kstRelationRepository.findOne({
            where: {
                id
            }
        })

        if (!relation) {
            throw new BadRequestException("Relation id not valid");
        }

        return relation;
    }

    async save(relation: KSTRelation) {
        return await this.kstRelationRepository.save(relation);
    }
}
