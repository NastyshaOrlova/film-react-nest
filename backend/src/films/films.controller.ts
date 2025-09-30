import { Controller, Get, Param } from '@nestjs/common';
import { FilmsListDto, FilmWithScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsListDto> {
    return this.filmsService.findAll();
  }
  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<FilmWithScheduleDto> {
    return this.filmsService.findSchedule(id);
  }
}
