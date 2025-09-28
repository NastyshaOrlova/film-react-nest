import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schema/film.schema';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}
  async createOrder(orderData: CreateOrderDto[]): Promise<OrderResultDto[]> {
    const groupedBySession = this.groupTicketsBySession(orderData);
    const results: OrderResultDto[] = [];

    for (const [sessionKey, tickets] of groupedBySession.entries()) {
      const [filmId, sessionId] = sessionKey.split('|');

      const bookedTickets = await this.bookSeatsForSession(
        filmId,
        sessionId,
        tickets,
      );
      results.push(...bookedTickets);
    }

    return results;
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

  private async bookSeatsForSession(
    filmId: string,
    sessionId: string,
    tickets: CreateOrderDto[],
  ): Promise<OrderResultDto[]> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      throw new Error(`Фильм с id ${filmId} не найден`);
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new Error(`Сеанс с id ${sessionId} не найден`);
    }

    const seatsToBook = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);
    this.validateSeatsAvailability(session.taken, seatsToBook);
    session.taken.push(...seatsToBook);

    await film.save();

    return tickets.map((ticket, index) => ({
      ...ticket,
      id: `order_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
    }));
  }

  private validateSeatsAvailability(
    takenSeats: string[],
    seatsToBook: string[],
  ): void {
    const takenSet = new Set(takenSeats);
    for (const seat of seatsToBook) {
      if (takenSet.has(seat)) {
        throw new Error(`Место ${seat} уже занято`);
      }
    }

    const uniqueSeats = new Set(seatsToBook);

    if (uniqueSeats.size !== seatsToBook.length) {
      throw new Error('В заказе есть дублирующиеся места');
    }
  }
}
