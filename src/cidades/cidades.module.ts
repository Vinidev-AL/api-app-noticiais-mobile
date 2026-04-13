import { Module } from '@nestjs/common';
import { CidadesController } from './cidades.controller';
import { CidadesService } from './cidades.service';
import { DbModule } from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [CidadesController],
    providers: [CidadesService],
})
export class CidadesModule { }
