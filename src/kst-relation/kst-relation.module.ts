import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KSTRelation } from './kst-relation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([KSTRelation])],
})
export class KstRelationModule {}
