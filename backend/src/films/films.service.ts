import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmsListDto, FilmWithScheduleDto } from './dto/films.dto';
import { Film, FilmDocument } from './schema/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmsListDto> {
    const films = await this.filmModel.find().exec();

    return {
      total: films.length,
      items: films.map((film) => ({
        id: film.id,
        rating: film.rating,
        director: film.director,
        tags: film.tags,
        title: film.title,
        about: film.about,
        description: film.description,
        image: film.image,
        cover: film.cover,
      })),
    };
  }

  async findSchedule(filmId: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      return null;
    }

    const filmWithSchedule = {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedule,
    };

    return filmWithSchedule;
  }
}
