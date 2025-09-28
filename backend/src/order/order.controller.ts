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
    try {
      const createdOrders = await this.orderService.createOrder(orderData);

      return {
        total: createdOrders.length,
        items: createdOrders,
      };
    } catch (error) {
      throw new Error(`Ошибка при создании заказа: ${error.message}`);
    }
  }
}
