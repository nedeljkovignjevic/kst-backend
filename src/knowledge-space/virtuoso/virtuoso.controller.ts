import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VirtuosoService } from './virtuoso.service';

@Controller('virtuoso')
export class VirtuosoController {
  constructor(private virtuosoService: VirtuosoService) {}

  @Get('/')
  async getAllGraphs() {
    return await this.virtuosoService.getAllGraphs();
  }

  @Post('/')
  async insertGraphData(@Body() graphData){
    return await this.virtuosoService.insertGraphData(graphData);
  }
}
