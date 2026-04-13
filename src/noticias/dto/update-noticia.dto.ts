import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticiaDto {
    @IsOptional()
    @IsString()
    titulo?: string;

    @IsOptional()
    @IsString()
    imagem?: string;

    @IsOptional()
    @IsString()
    resumo?: string;

    @IsOptional()
    @IsString()
    texto?: string;
}
