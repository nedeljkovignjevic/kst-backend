import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditKSTConceptDTO {

    id: number;

    @IsString()
    @IsNotEmpty()
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

export class EditKSTRelationDTO {

    id: number;
    
    @IsString()
    source: string;

    @IsString()
    target: string;
}

export class EditKnowledgeSpaceDTO {

    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    graphName: string;
    
    @IsString()
    @IsNotEmpty()
    graphDescription: string;

    @IsNotEmpty()
    concepts: EditKSTConceptDTO[]

    @IsNotEmpty()
    links: EditKSTRelationDTO[]
}