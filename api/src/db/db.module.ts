import { Module } from '@nestjs/common';
import Database = require('better-sqlite3');
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DB = Symbol('DB');

@Module({
    providers: [
        {
            provide: DB,
            useFactory: () => {
                const dbPath = process.env.DATABASE_URL ?? 'data/app.db';
                const sqlite = new Database(dbPath);
                sqlite.pragma('foreign_keys = ON');
                return drizzle(sqlite, { schema });
            },
        },
    ],
    exports: [DB],
})
export class DbModule { }
