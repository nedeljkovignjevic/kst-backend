import { Controller, Get, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VirtuosoService {
  constructor(private httpService: HttpService) {}

  async getAllGraphs(): Promise<any> {
    const query = `
      PREFIX : <http://localhost:8890/graphs#>
      SELECT ?graph ?name ?description WHERE {
        ?graph a :Graph .
        ?graph :graphName ?name .
        ?graph :graphDescription ?description .
      }
    `;

    try {
      const response = await lastValueFrom(
        this.httpService.post('http://localhost:8890/sparql', null, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' },
        }),
      );
      return response.data.results.bindings;
    } catch (error) {
      // Handle errors, possibly throw an application-specific error
      console.error(error);
      throw error;
    }
  }
}

@Controller('virtuoso')
export class GraphsController {
  constructor(private virtuosoService: VirtuosoService) {}

  @Get('/')
  async getAllGraphs() {
    return await this.virtuosoService.getAllGraphs();
  }
}
