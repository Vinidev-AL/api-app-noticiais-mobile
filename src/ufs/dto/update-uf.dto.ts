import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUfDto {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsString()
    @Length(2, 2)
    sigla?: string;
}
