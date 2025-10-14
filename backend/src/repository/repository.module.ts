import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film as TypeOrmFilm } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { IFilmsRepository } from './films.repository.interface';
import { FilmsTypeOrmRepository } from './films.typeorm.repository';

@Module({})
export class RepositoryModule {
  static forRoot(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forFeature([TypeOrmFilm, Schedule]),
      ],
      providers: [
        FilmsTypeOrmRepository,
        {
          provide: IFilmsRepository,
          useExisting: FilmsTypeOrmRepository,
        },
      ],
      exports: [IFilmsRepository],
    };
  }
}
