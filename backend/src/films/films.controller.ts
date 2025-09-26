import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponseDto, FilmDto, SessionDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  @Get()
  async getFilms(): Promise<ApiResponseDto<FilmDto>> {
    // Заглушка
    const mockFilms: FilmDto[] = [
      {
        id: '1',
        rating: 8.5,
        director: 'Джеймс Кэмерон',
        tags: ['драма', 'мелодрама'],
        title: 'Титаник',
        about: 'История любви на борту легендарного корабля',
        description: 'Подробное описание фильма...',
        image: '/content/afisha/bg1s.jpg',
        cover: '/content/afisha/bg1c.jpg',
      },
      {
        id: '2',
        rating: 9.0,
        director: 'Джеймс Кэмерон',
        tags: ['фантастика', 'боевик'],
        title: 'Аватар',
        about: 'Приключения на далекой планете Пандора',
        description: 'Подробное описание фильма...',
        image: '/content/afisha/bg2s.jpg',
        cover: '/content/afisha/bg2c.jpg',
      },
    ];

    return {
      total: mockFilms.length,
      items: mockFilms,
    };
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<SessionDto>> {
    console.log(`Получение расписания для фильма с id: ${id}`);
    return {
      total: 3,
      items: [
        {
          id: '1',
          daytime: '2025-09-27 19:00',
          hall: 'Зал 1',
          rows: 10,
          seats: 12,
          price: 350,
          taken: ['1-5', '2-3', '3-7'],
        },
        {
          id: '2',
          daytime: '2025-09-27 21:30',
          hall: 'Зал 2',
          rows: 8,
          seats: 10,
          price: 400,
          taken: ['1-1', '1-2'],
        },
      ],
    };
  }
}
