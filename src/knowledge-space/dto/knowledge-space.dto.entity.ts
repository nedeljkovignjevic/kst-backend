import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class KSTConceptDTO {

    @IsNumber()
    id: number;

    @IsString()
    key: string;

    @IsString()
    @IsNotEmpty()
    concept: string;

    @IsNumber()
    @IsNotEmpty()
    x: number;

    @IsNumber()
    @IsNotEmpty()
    y: number;
}

export class KSTRelationDTO {

    @IsNumber()
    id: number;

    @IsString()
    source: string;

    @IsString()
    target: string;
}

export class KnowledgeSpaceDTO {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsString()
    @IsNotEmpty()
    graphName: string;
    
    @IsString()
    @IsNotEmpty()
    graphDescription: string;

    @IsNotEmpty()
    concepts: KSTConceptDTO[];

    @IsNotEmpty()
    links: KSTRelationDTO[];
}