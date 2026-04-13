import { IsOptional, IsString } from 'class-validator';

export class CreateNoticiaDto {
    @IsString()
    titulo: string;

    @IsOptional()
    @IsString()
    imagem?: string;

    @IsString()
    resumo: string;

    @IsString()
    texto: string;
}
