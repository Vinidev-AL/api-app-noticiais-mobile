import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CidadesModule } from './cidades/cidades.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { DbModule } from './db/db.module';
import { NoticiasModule } from './noticias/noticias.module';
import { PerfisModule } from './perfis/perfis.module';
import { TagsModule } from './tags/tags.module';
import { UfsModule } from './ufs/ufs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    UsersModule,
    PerfisModule,
    NoticiasModule,
    ComentariosModule,
    TagsModule,
    UfsModule,
    CidadesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
