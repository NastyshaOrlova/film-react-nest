// Для входящего POST /order (массив билетов)
export class CreateOrderDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

// Для ответа POST /order (добавляется id)
export class OrderResultDto extends CreateOrderDto {
  id: string;
}

// Обертка для ответа
export class OrderResponseDto {
  total: number;
  items: OrderResultDto[];
}
