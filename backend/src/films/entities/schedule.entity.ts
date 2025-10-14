import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  daytime: string;

  @Column('integer')
  hall: number;

  @Column('integer')
  rows: number;

  @Column('integer')
  seats: number;

  @Column('double precision')
  price: number;

  @Column('text')
  taken: string;

  @Column('uuid')
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
