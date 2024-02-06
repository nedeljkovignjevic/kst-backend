import { Module } from '@nestjs/common';
import { KnowledgeSpaceService } from './knowledge-space.service';
import { KnowledgeSpaceController } from './knowledge-space.controller';
import { KnowledgeSpace } from './knowledge-space.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KSTNode } from 'src/kst-node/kst-node.entity';
import { KstNodeModule } from 'src/kst-node/kst-node.module';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeSpace]), KstNodeModule],
  providers: [KnowledgeSpaceService],
  controllers: [KnowledgeSpaceController]
})
export class KnowledgeSpaceModule {}
