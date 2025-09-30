import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsMongoRepository } from '../repository/films.mongo.repository';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './schema/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: IFilmsRepository,
      useClass: FilmsMongoRepository,
    },
  ],
})
export class FilmsModule {}
