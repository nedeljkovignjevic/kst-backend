import { Module } from '@nestjs/common';
import { KnowledgeSpaceService } from './knowledge-space.service';

@Module({
  providers: [KnowledgeSpaceService]
})
export class KnowledgeSpaceModule {}
