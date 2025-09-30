// order.service.ts
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(IFilmsRepository)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async createOrder(orderData: CreateOrderDto[]): Promise<OrderResultDto[]> {
    const groupedBySession = this.groupTicketsBySession(orderData);
    const uniqueFilmIds = Array.from(
      new Set(orderData.map((ticket) => ticket.film)),
    );

    const filmsMap = await this.filmsRepository.findByIds(uniqueFilmIds);

    const bookingUpdates: Array<{
      filmId: string;
      sessionId: string;
      seats: string[];
    }> = [];

    for (const [sessionKey, tickets] of groupedBySession.entries()) {
      const [filmId, sessionId] = sessionKey.split('|');

      const film = filmsMap.get(filmId);
      if (!film) {
        throw new NotFoundException(`Фильм с id ${filmId} не найден`);
      }

      const session = film.schedule.find((s) => s.id === sessionId);
      if (!session) {
        throw new NotFoundException(
          `Сеанс с id ${sessionId} для фильма ${filmId} не найден`,
        );
      }

      const seatsToBook = tickets.map((t) => `${t.row}:${t.seat}`);
      this.validateSeatsAvailability(session.taken, seatsToBook);

      bookingUpdates.push({
        filmId,
        sessionId,
        seats: seatsToBook,
      });
    }

    await this.filmsRepository.bookSeatsInBulk(bookingUpdates);
    return orderData.map((ticket, index) => ({
      ...ticket,
      id: `order_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
    }));
  }

  private groupTicketsBySession(
    tickets: CreateOrderDto[],
  ): Map<string, CreateOrderDto[]> {
    const grouped = new Map<string, CreateOrderDto[]>();

    for (const ticket of tickets) {
      const sessionKey = `${ticket.film}|${ticket.session}`;

      if (!grouped.has(sessionKey)) {
        grouped.set(sessionKey, []);
      }
      grouped.get(sessionKey)!.push(ticket);
    }

    return grouped;
  }

  private validateSeatsAvailability(
    takenSeats: string[],
    seatsToBook: string[],
  ): void {
    const takenSet = new Set(takenSeats);
    for (const seat of seatsToBook) {
      if (takenSet.has(seat)) {
        throw new ConflictException(`Место ${seat} уже занято`);
      }
    }

    const uniqueSeats = new Set(seatsToBook);
    if (uniqueSeats.size !== seatsToBook.length) {
      throw new BadRequestException('В заказе есть дублирующиеся места');
    }
  }
}
