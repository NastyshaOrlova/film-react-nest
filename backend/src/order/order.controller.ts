import { Body, Controller, Post } from '@nestjs/common';
import { CreateFullOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() orderData: CreateFullOrderDto,
  ): Promise<OrderResponseDto> {
    const createdOrders = await this.orderService.createOrder(
      orderData.tickets,
    );

    return {
      total: createdOrders.length,
      items: createdOrders,
    };
  }
}
