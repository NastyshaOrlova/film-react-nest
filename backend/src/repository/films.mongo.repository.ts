import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findSessionById(
    filmId: string,
    sessionId: string,
  ): Promise<SessionDto | null> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) return null;

    const session = film.schedule.find((s) => s.id === sessionId);
    return session || null;
  }

  async bookSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new NotFoundException(`Сеанс с id ${sessionId} не найден`);
    }

    session.taken.push(...seats);
    await film.save();
  }
  async findByIds(filmIds: string[]): Promise<Map<string, FilmDocument>> {
    const films = await this.filmModel
      .find({ id: { $in: filmIds } }) // 👈 Один запрос для всех фильмов!
      .exec();

    const filmMap = new Map<string, FilmDocument>();
    films.forEach((film) => {
      filmMap.set(film.id, film);
    });

    return filmMap;
  }

  async bookSeatsInBulk(
    updates: Array<{ filmId: string; sessionId: string; seats: string[] }>,
  ): Promise<void> {
    const filmUpdates = new Map<
      string,
      Array<{ sessionId: string; seats: string[] }>
    >();

    for (const update of updates) {
      if (!filmUpdates.has(update.filmId)) {
        filmUpdates.set(update.filmId, []);
      }
      filmUpdates.get(update.filmId)!.push({
        sessionId: update.sessionId,
        seats: update.seats,
      });
    }

    for (const [filmId, sessionUpdates] of filmUpdates.entries()) {
      const film = await this.filmModel.findOne({ id: filmId }).exec();

      if (!film) {
        throw new NotFoundException(`Фильм с id ${filmId} не найден`);
      }

      for (const { sessionId, seats } of sessionUpdates) {
        const session = film.schedule.find((s) => s.id === sessionId);
        if (!session) {
          throw new NotFoundException(`Сеанс с id ${sessionId} не найден`);
        }
        session.taken.push(...seats);
      }

      await film.save();
    }
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
}
