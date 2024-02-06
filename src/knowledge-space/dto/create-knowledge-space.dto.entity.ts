import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class KSTConceptDTO {

    @IsString()
    key: string;

    @IsString()
    @IsNotEmpty()
    concept: string;

    @IsNumber()
    @IsNotEmpty()
    questionLevel: number;

    @IsNumber()
    @IsNotEmpty()
    x: number;

    @IsNumber()
    @IsNotEmpty()
    y: number;
}

export class CreateKnowledgeSpaceDTO {

    @IsString()
    @IsNotEmpty()
    graphName: string;
    
    @IsString()
    @IsNotEmpty()
    graphDescription: string;

    @IsNotEmpty()
    concepts: KSTConceptDTO[]
}