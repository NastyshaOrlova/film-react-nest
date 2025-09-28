import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto, SessionDto } from '../films/dto/films.dto';
import { Film, FilmDocument } from '../films/schema/film.schema';
import { IFilmsRepository } from './films.repository.interface';

@Injectable()
export class FilmsMongoRepository implements IFilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.entityToDto(film));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.entityToDto(film) : null;
  }

  async findScheduleById(filmId: string): Promise<SessionDto[]> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    return film ? film.schedule : [];
  }

  async create(filmData: Partial<FilmDto>): Promise<FilmDto> {
    const entity = this.dtoToEntity(filmData);
    const created = await this.filmModel.create(entity);
    return this.entityToDto(created);
  }

  async update(
    id: string,
    filmData: Partial<FilmDto>,
  ): Promise<FilmDto | null> {
    const updated = await this.filmModel
      .findOneAndUpdate({ id }, filmData, { new: true })
      .exec();
    return updated ? this.entityToDto(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.filmModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  private entityToDto(film: FilmDocument): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private dtoToEntity(dto: Partial<FilmDto>): Partial<Film> {
    return {
      id: dto.id,
      rating: dto.rating,
      director: dto.director,
      tags: dto.tags,
      title: dto.title,
      about: dto.about,
      description: dto.description,
      image: dto.image,
      cover: dto.cover,
    };
  }
}
