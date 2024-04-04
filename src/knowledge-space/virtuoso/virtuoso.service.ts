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
        let sourceUuid = binding.source.value;
        let targetUuid = binding.target.value;
        console.log('SourceId', sourceUuid)
        console.log('TargetId', targetUuid)
        // Check if the value is a URI and extract the UUID part
        if (sourceUuid.startsWith("http://")) {
          sourceUuid = sourceUuid.split('#').pop();
        }
        if (targetUuid.startsWith("http://")) {
          targetUuid = targetUuid.split('#').pop();
        }
        
        graph.links.push({
          id: binding.linkId.value,
          source: sourceUuid,
          target: targetUuid
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
      console.log('Reading from db: ', this.mapSparqlResultsToGraph(response.data.results.bindings));
      return this.mapSparqlResultsToGraph(response.data.results.bindings);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Virtuoso ima interni bug
  // Bugfix koji je leader openview rekao na forumima je u isql da se 
  // execute ova komanda: DB.DBA.RDF_DEFAULT_USER_PERMS_SET ('nobody', 7);
  async insertGraphData(graphData) {
    const sparqlEndpoint = 'http://host.docker.internal:8890/sparql';
    for (let concept of graphData.concepts) {
      const min = Math.ceil(1);
      const max = Math.floor(999999);
      concept.id = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    console.log('insertGraphData called with:', graphData);

    // If graphData is not array make it array with one object
    if (!Array.isArray(graphData)) {
      graphData = [graphData]; 
    }

    for (const graph of graphData) {
      let query = `
        PREFIX : <http://localhost:8890/graphs#>
        INSERT DATA {
          GRAPH <http://localhost:8890/graphs#${graph.id}> {
            :${graph.id} a :Graph ;
                :graphId "${graph.id}" ;
                :graphName "${graph.graphName}" ;
                :graphDescription "${graph.graphDescription}" .
      `;
  
      for (const concept of graph.concepts) {
        query += `
            :${concept.id} a :Concept ;
                :conceptId "${concept.id}" ;
                :concept "${concept.concept}" ;
                :key "${concept.key}" ;
                :x "${concept.x}"^^xsd:float ;
                :y "${concept.y}"^^xsd:float .
            :${graph.id} :hasConcept :${concept.id} .
        `;
      }
  
      for (const link of graph.links) {
        if (link.source && link.target) {
          query += `
            :${link.id} a :Link ;
                :linkId "${link.id}" ;
                :source "${link.source}"^^xsd:string ;
                :target "${link.target}"^^xsd:string .
            :${graph.id} :hasLink :${link.id} .
          `;
        } else {
          console.log('One of the links is undefined or empty.');
        }
      }
      
      query += '  } }';
      console.log('Final query is: ', query)

      try {
        const response = await lastValueFrom(this.httpService.post(sparqlEndpoint, query, {
          headers: { 'Content-Type': 'application/sparql-query' },
        }));

        console.log('Insert response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
      }
    }
  }

}
