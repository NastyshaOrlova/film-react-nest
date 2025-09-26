import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() orderData: CreateOrderDto[],
  ): Promise<OrderResponseDto> {
    // Заглушка
    const createdOrders = orderData.map((order, index) => ({
      ...order,
      id: `order_${Date.now()}_${index}`,
    }));

    return {
      total: createdOrders.length,
      items: createdOrders,
    };
  }
}
