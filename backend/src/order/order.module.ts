import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schema/film.schema';
import { FilmsMongoRepository } from '../repository/films.mongo.repository';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: IFilmsRepository,
      useClass: FilmsMongoRepository,
    },
  ],
})
export class OrderModule {}
