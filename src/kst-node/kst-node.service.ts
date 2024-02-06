import { BadRequestException, Injectable } from '@nestjs/common';
import { KSTNode } from './kst-node.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class KstNodeService {

    constructor(
        @InjectRepository(KSTNode)
        private kstNodeRepository: Repository<KSTNode>,
    ) {}

    async findOneById(id: number) {
        let node = await this.kstNodeRepository.findOne({
            where: {
                id
            }
        })

        if (!node) {
            throw new BadRequestException("Node id not valid");
        }

        return node;
    }

    async save(node: KSTNode) {
        return await this.kstNodeRepository.save(node);
    }


}
