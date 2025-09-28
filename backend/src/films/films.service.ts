import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponseDto, FilmDto, SessionDto } from './dto/films.dto';
import { Film, FilmDocument } from './schema/film.schema';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<ApiResponseDto<FilmDto>> {
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

  async findSchedule(filmId: string): Promise<ApiResponseDto<SessionDto>> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      return { total: 0, items: [] };
    }

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
