import { FilmDto, SessionDto } from '../films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findById(id: string): Promise<FilmDto | null>;
  findScheduleById(filmId: string): Promise<SessionDto[]>;
  create(filmData: Partial<FilmDto>): Promise<FilmDto>;
  update(id: string, filmData: Partial<FilmDto>): Promise<FilmDto | null>;
  delete(id: string): Promise<boolean>;
}
