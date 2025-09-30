import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsString({ message: 'ID фильма должен быть строкой' })
  @IsNotEmpty({ message: 'ID фильма обязателен' })
  film: string;

  @IsString({ message: 'ID сеанса должен быть строкой' })
  @IsNotEmpty({ message: 'ID сеанса обязателен' })
  session: string;

  @IsString({ message: 'Время сеанса должно быть строкой' })
  @IsNotEmpty({ message: 'Время сеанса обязателен' })
  daytime: string;

  @IsNumber({}, { message: 'Номер ряда должен быть числом' })
  row: number;

  @IsNumber({}, { message: 'Номер места должен быть числом' })
  seat: number;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  price: number;
}

export class OrderResultDto extends CreateOrderDto {
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: OrderResultDto[];
}

export class CreateFullOrderDto {
  @IsEmail({}, { message: 'Укажите корректный email' })
  email: string;

  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Телефон обязателен' })
  phone: string;

  @IsArray({ message: 'Билеты должны быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  tickets: CreateOrderDto[];
}
