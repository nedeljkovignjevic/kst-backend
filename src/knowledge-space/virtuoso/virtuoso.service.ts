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
        // http://localhost:8890/sparql if nest is on same machine as virtuoso
        // Since nest is in docker and virtuoso isn't we use this below
        this.httpService.post('http://host.docker.internal:8890/sparql', null, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' },
        }),
      );
      return response.data.results.bindings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
