import { Module } from '@nestjs/common';
import { KSTNode } from './kst-node.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([KSTNode])],
})
export class KstNodeModule {}
