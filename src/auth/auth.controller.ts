import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Autenticar usuario' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
    @ApiResponse({
        status: 401,
        description: 'Credenciais invalidas.',
        schema: {
            example: {
                statusCode: 401,
                message: 'Credenciais invalidas.',
                error: 'Unauthorized',
            },
        },
    })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('cadastro')
    @ApiOperation({ summary: 'Auto-cadastro como LEITOR' })
    @ApiResponse({ status: 201, description: 'Usuario cadastrado com sucesso.' })
    @ApiResponse({
        status: 409,
        description: 'Username ja existe.',
        schema: {
            example: {
                statusCode: 409,
                message: 'Username ja existe.',
                error: 'Conflict',
            },
        },
    })
    cadastro(@Body() dto: CadastroDto) {
        return this.authService.cadastro(dto);
    }
}
