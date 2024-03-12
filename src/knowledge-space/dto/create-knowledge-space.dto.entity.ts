import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateKSTConceptDTO {

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

export class CreateKSTRelationDTO {

    @IsString()
    source: string;

    @IsString()
    target: string;
}

export class CreateKnowledgeSpaceDTO {

    @IsString()
    @IsNotEmpty()
    graphName: string;
    
    @IsString()
    @IsNotEmpty()
    graphDescription: string;

    @IsNotEmpty()
    concepts: CreateKSTConceptDTO[]

    @IsNotEmpty()
    links: CreateKSTRelationDTO[]
}