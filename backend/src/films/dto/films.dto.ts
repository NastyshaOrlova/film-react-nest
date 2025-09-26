// Для GET /films
export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

// Для GET /films/:id/schedule
export class SessionDto {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

// Обертка для всех ответов
export class ApiResponseDto<T> {
  total: number;
  items: T[];
}
