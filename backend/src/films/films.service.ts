import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { FilmsListDto, FilmWithScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(IFilmsRepository)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<FilmsListDto> {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films,
    };
  }

  async findSchedule(filmId: string): Promise<FilmWithScheduleDto> {
    const film = await this.filmsRepository.findById(filmId);

    if (!film) {
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }

    const schedule = await this.filmsRepository.findScheduleById(filmId);

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
