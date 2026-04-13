import { Module } from '@nestjs/common';
import { NoticiasController } from './noticias.controller';
import { NoticiasService } from './noticias.service';
import { DbModule } from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [NoticiasController],
    providers: [NoticiasService],
    exports: [NoticiasService],
})
export class NoticiasModule { }
