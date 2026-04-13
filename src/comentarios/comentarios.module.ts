import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { DbModule } from '../db/db.module';
import { ComentariosAdminController } from './comentarios-admin.controller';

@Module({
    imports: [DbModule],
    controllers: [ComentariosController, ComentariosAdminController],
    providers: [ComentariosService],
})
export class ComentariosModule { }
