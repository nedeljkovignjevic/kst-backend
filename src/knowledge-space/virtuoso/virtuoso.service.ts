import { Controller, Get, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VirtuosoService {
  constructor(private httpService: HttpService) {}

  private mapSparqlResultsToGraph(sparqlResults: any): any {
    const graphs = new Map<string, any>();
  
    sparqlResults.forEach((binding: any) => {
      const graphId = binding.graph.value;
      let graph = graphs.get(graphId);
  
      if (!graph) {
        graph = {
          id: binding.graphId.value,
          graphName: binding.graphName.value,
          graphDescription: binding.graphDescription.value,
          concepts: [],
          links: []
        };
        graphs.set(graphId, graph);
      }
  
      // Duplicate checker
      if (binding.conceptId && !graph.concepts.find(c => c.id === binding.conceptId.value)) {
        graph.concepts.push({
          id: binding.conceptId.value,
          key: binding.key.value,
          concept: binding.concept.value,
          x: parseFloat(binding.x.value),
          y: parseFloat(binding.y.value)
        });
      }
  
      if (binding.linkId && !graph.links.find(l => l.id === binding.linkId.value)) {
        graph.links.push({
          id: binding.linkId.value,
          source: binding.source.value,
          target: binding.target.value
        });
      }
    });
  
    return Array.from(graphs.values());
  }
  
  
  
  // DESCRIBE <http://localhost:8890/graphs#concept1>
  async getAllGraphs(): Promise<any> {
    const query = `
    PREFIX : <http://localhost:8890/graphs#>

    SELECT ?graph ?graphId ?graphName ?graphDescription ?cnpt ?concept ?conceptId ?key ?x ?y ?link ?linkId ?source ?target
    WHERE {
      ?graph a :Graph ;
            :graphId ?graphId ;
            :graphName ?graphName ;
            :graphDescription ?graphDescription .
      OPTIONAL {
        ?graph :hasConcept ?cnpt .
        ?cnpt
                :concept ?concept ; 
                :conceptId ?conceptId ;
                :key ?key ;
                :x ?x ;
                :y ?y .
      }
      OPTIONAL {
        ?graph :hasLink ?link .
        ?link :linkId ?linkId ;
              :source ?source ;
              :target ?target .
      }
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
      return this.mapSparqlResultsToGraph(response.data.results.bindings);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
