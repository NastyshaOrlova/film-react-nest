import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponseDto, FilmDto, SessionDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<ApiResponseDto<FilmDto>> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<SessionDto>> {
    console.log(`Получение расписания для фильма с id: ${id}`);
    return this.filmsService.findSchedule(id);
  }
}
