import { IsOptional, IsString } from 'class-validator';

export class UpdateCidadeDto {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsString()
    ufId?: string;
}
