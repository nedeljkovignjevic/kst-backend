import { Body, Controller, Get, Post } from '@nestjs/common';
import { KnowledgeSpace } from './knowledge-space.entity';
import { KnowledgeSpaceService } from './knowledge-space.service';
import { CreateKnowledgeSpaceDTO } from './dto/create-knowledge-space.dto.entity';

@Controller('knowledge-space')
export class KnowledgeSpaceController {

    constructor(private knowledgeSpaceService: KnowledgeSpaceService) {}

    @Get('/')
    async getAllKnowledgeSpaces() {

        return await this.knowledgeSpaceService.getAllKnowledgeSpaces();
    }


    @Post('/')
    async createKnowledgeSpace(@Body() data: CreateKnowledgeSpaceDTO): Promise<KnowledgeSpace> {

        return await this.knowledgeSpaceService.createKnowledgeSpace(data);
    }
}
