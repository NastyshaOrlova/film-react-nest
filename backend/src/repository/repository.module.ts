import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schema/film.schema';
import { FilmsMongoRepository } from './films.mongo.repository';
import { IFilmsRepository } from './films.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [
    {
      provide: IFilmsRepository,
      useClass: FilmsMongoRepository,
    },
  ],
  exports: [IFilmsRepository],
})
export class RepositoryModule {}
