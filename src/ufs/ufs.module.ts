import { Module } from '@nestjs/common';
import { UfsController } from './ufs.controller';
import { UfsService } from './ufs.service';
import { DbModule } from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [UfsController],
    providers: [UfsService],
})
export class UfsModule { }
