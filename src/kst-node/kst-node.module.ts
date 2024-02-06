import { Module } from '@nestjs/common';
import { KSTNode } from './kst-node.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KstNodeService } from './kst-node.service';

@Module({
    imports: [TypeOrmModule.forFeature([KSTNode])],
    providers: [KstNodeService],
    exports: [KstNodeService]
})
export class KstNodeModule {}
