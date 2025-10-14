import { FilmDto, SessionDto } from '../films/dto/films.dto';

export const IFilmsRepository = Symbol('IFilmsRepository');

// Универсальный тип для фильма с расписанием
export interface FilmWithSchedule {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: Array<{
    id: string;
    daytime: string;
    hall: number;
    rows: number;
    seats: number;
    price: number;
    taken: string[];
  }>;
}

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findById(id: string): Promise<FilmDto | null>;
  findScheduleById(filmId: string): Promise<SessionDto[]>;
  findSessionById(
    filmId: string,
    sessionId: string,
  ): Promise<SessionDto | null>;
  bookSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean>;
  findByIds(filmIds: string[]): Promise<Map<string, FilmWithSchedule>>; // ← ИЗМЕНИЛИ
  bookSeatsInBulk(
    updates: Array<{ filmId: string; sessionId: string; seats: string[] }>,
  ): Promise<boolean>;
}
