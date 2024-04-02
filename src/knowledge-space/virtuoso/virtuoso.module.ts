import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VirtuosoService } from './virtuoso.service';
import { VirtuosoController } from './virtuoso.controller';

@Module({
  imports: [HttpModule],
  controllers: [VirtuosoController],
  providers: [VirtuosoService],
})
export class VirtuosoModule {}