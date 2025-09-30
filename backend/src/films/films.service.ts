import { Injectable } from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { FilmsListDto, FilmWithScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: IFilmsRepository) {}

  async findAll(): Promise<FilmsListDto> {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films,
    };
  }

  async findSchedule(filmId: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmsRepository.findById(filmId);

    if (!film) {
      return null;
    }

    const schedule = await this.filmsRepository.findScheduleById(filmId);

    return {
      ...film,
      schedule,
    };
  }
}
