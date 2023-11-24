import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from './test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestsService],
  exports: [TestsService]
})
export class TestsModule {}
