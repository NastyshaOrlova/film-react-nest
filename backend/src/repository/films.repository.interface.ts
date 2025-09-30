import { FilmDto, SessionDto } from '../films/dto/films.dto';

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
}
