import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmDto, SessionDto } from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import {
  FilmWithSchedule,
  IFilmsRepository,
} from './films.repository.interface';

@Injectable()
export class FilmsTypeOrmRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();
    return films.map((film) => this.entityToDto(film));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({ where: { id } });
    return film ? this.entityToDto(film) : null;
  }

  async findScheduleById(filmId: string): Promise<SessionDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { filmId },
    });
    return schedules.map((schedule) => this.scheduleToDto(schedule));
  }

  async findSessionById(
    filmId: string,
    sessionId: string,
  ): Promise<SessionDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { filmId, id: sessionId },
    });
    return schedule ? this.scheduleToDto(schedule) : null;
  }

  async bookSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const schedule = await this.scheduleRepository.findOne({
      where: { filmId, id: sessionId },
    });

    if (!schedule) return false;

    const currentTaken = schedule.taken
      ? schedule.taken.split(',').filter((s) => s.trim())
      : [];

    const newTaken = [...currentTaken, ...seats];
    schedule.taken = newTaken.join(',');

    await this.scheduleRepository.save(schedule);
    return true;
  }

  async findByIds(filmIds: string[]): Promise<Map<string, FilmWithSchedule>> {
    const films = await this.filmRepository
      .createQueryBuilder('film')
      .leftJoinAndSelect('film.schedule', 'schedule')
      .where('film.id IN (:...filmIds)', { filmIds })
      .getMany();

    const filmMap = new Map<string, FilmWithSchedule>();

    films.forEach((film) => {
      const schedules = film.schedule
        ? film.schedule.map((s) => ({
            id: s.id,
            daytime: s.daytime,
            hall: s.hall,
            rows: s.rows,
            seats: s.seats,
            price: s.price,
            taken: s.taken
              ? s.taken.split(',').filter((seat) => seat.trim())
              : [],
          }))
        : [];

      filmMap.set(film.id, {
        id: film.id,
        rating: film.rating,
        director: film.director,
        tags: film.tags ? film.tags.split(',').filter((t) => t.trim()) : [],
        title: film.title,
        about: film.about,
        description: film.description,
        image: film.image,
        cover: film.cover,
        schedule: schedules,
      });
    });

    return filmMap;
  }

  async bookSeatsInBulk(
    updates: Array<{ filmId: string; sessionId: string; seats: string[] }>,
  ): Promise<boolean> {
    for (const update of updates) {
      const success = await this.bookSeats(
        update.filmId,
        update.sessionId,
        update.seats,
      );
      if (!success) return false;
    }
    return true;
  }

  private entityToDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags ? film.tags.split(',').filter((t) => t.trim()) : [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private scheduleToDto(schedule: Schedule): SessionDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken
        ? schedule.taken.split(',').filter((s) => s.trim())
        : [],
    };
  }
}
