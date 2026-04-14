import { Module } from '@nestjs/common';
import { PerfisController } from './perfis.controller';
import { PerfisService } from './perfis.service';
import { DbModule } from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [PerfisController],
    providers: [PerfisService],
})
export class PerfisModule { }
