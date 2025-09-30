import { FilmDto, SessionDto } from '../films/dto/films.dto';
import { FilmDocument } from '../films/schema/film.schema';

export const IFilmsRepository = Symbol('IFilmsRepository');

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findById(id: string): Promise<FilmDto | null>;
  findScheduleById(filmId: string): Promise<SessionDto[]>;
  findSessionById(
    filmId: string,
    sessionId: string,
  ): Promise<SessionDto | null>;
  bookSeats(filmId: string, sessionId: string, seats: string[]): Promise<void>;
  findByIds(filmIds: string[]): Promise<Map<string, FilmDocument>>;
  bookSeatsInBulk(
    updates: Array<{ filmId: string; sessionId: string; seats: string[] }>,
  ): Promise<void>;
}
