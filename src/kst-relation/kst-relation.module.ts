import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KSTRelation } from './kst-relation.entity';
import { KstRelationService } from './kst-relation.service';

@Module({
    imports: [TypeOrmModule.forFeature([KSTRelation])],
    providers: [KstRelationService],
    exports: [KstRelationService]
})
export class KstRelationModule {}
