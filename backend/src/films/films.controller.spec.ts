import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsListDto, FilmWithScheduleDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('проверяем что getFilms возвращает список фильмов', async () => {
      const mockResult: FilmsListDto = {
        total: 2,
        items: [
          {
            id: '1',
            title: 'Test Film 1',
            about: 'Short description 1',
            description: 'Full description 1',
            image: 'https://example.com/poster1.jpg',
            cover: 'https://example.com/cover1.jpg',
            rating: 8.5,
            director: 'Director 1',
            tags: ['drama', 'thriller'],
          },
          {
            id: '2',
            title: 'Test Film 2',
            about: 'Short description 2',
            description: 'Full description 2',
            image: 'https://example.com/poster2.jpg',
            cover: 'https://example.com/cover2.jpg',
            rating: 7.0,
            director: 'Director 2',
            tags: ['comedy'],
          },
        ],
      };

      mockFilmsService.findAll.mockResolvedValue(mockResult);
      const result = await controller.getFilms();
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('проверяем случай когда фильмов нет', async () => {
      const mockResult: FilmsListDto = {
        total: 0,
        items: [],
      };

      mockFilmsService.findAll.mockResolvedValue(mockResult);
      const result = await controller.getFilms();
      expect(result).toEqual(mockResult);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('getFilmSchedule', () => {
    it('проверяем что getFilmSchedule возвращает расписание для валидного ID', async () => {
      const filmId = '1';

      const mockResult: FilmWithScheduleDto = {
        total: 2,
        items: [
          {
            id: '1',
            daytime: '2024-11-03T18:00:00Z',
            hall: 1,
            rows: 10,
            seats: 15,
            price: 500,
            taken: ['A1', 'A2'],
          },
          {
            id: '2',
            daytime: '2024-11-03T20:00:00Z',
            hall: 2,
            rows: 12,
            seats: 20,
            price: 600,
            taken: ['B1'],
          },
        ],
      };

      mockFilmsService.findSchedule.mockResolvedValue(mockResult);
      const result = await controller.getFilmSchedule(filmId);
      expect(result).toEqual(mockResult);
      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
      expect(service.findSchedule).toHaveBeenCalledTimes(1);
    });

    it('проверяем что выбрасывается NotFoundException для несуществующего фильма', async () => {
      const filmId = '999';
      mockFilmsService.findSchedule.mockRejectedValue(
        new NotFoundException(`Фильм с id ${filmId} не найден`),
      );

      await expect(controller.getFilmSchedule(filmId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
