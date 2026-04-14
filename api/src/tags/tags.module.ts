import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { DbModule } from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [TagsController],
    providers: [TagsService],
})
export class TagsModule { }
