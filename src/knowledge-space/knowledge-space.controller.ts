import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { KnowledgeSpace } from './knowledge-space.entity';
import { KnowledgeSpaceService } from './knowledge-space.service';
import { CreateKnowledgeSpaceDTO } from './dto/create-knowledge-space.dto.entity';
import { EditKnowledgeSpaceDTO } from './dto/edit-knowledge-space.dto.entity';

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

    @Put('/')
    async editKnowledgeSpace(@Body() data: EditKnowledgeSpaceDTO): Promise<KnowledgeSpace> {

        return await this.knowledgeSpaceService.editKnowledgeSpace(data);
    }
}
