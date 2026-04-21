import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    @ApiProperty({
        description: 'Username do usuario para recuperar senha.',
        example: 'editor',
    })
    username: string;
}
