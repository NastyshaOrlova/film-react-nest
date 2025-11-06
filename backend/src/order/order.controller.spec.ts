import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  CreateFullOrderDto,
  OrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('проверяем что createOrder создаёт заказ и возвращает результат', async () => {
      const orderData: CreateFullOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: 'film1',
            session: 'session1',
            daytime: '2024-11-03T18:00:00Z',
            row: 5,
            seat: 10,
            price: 500,
          },
          {
            film: 'film1',
            session: 'session1',
            daytime: '2024-11-03T18:00:00Z',
            row: 5,
            seat: 11,
            price: 500,
          },
        ],
      };

      const mockResult: OrderResultDto[] = [
        {
          id: 'order_123',
          film: 'film1',
          session: 'session1',
          daytime: '2024-11-03T18:00:00Z',
          row: 5,
          seat: 10,
          price: 500,
        },
        {
          id: 'order_124',
          film: 'film1',
          session: 'session1',
          daytime: '2024-11-03T18:00:00Z',
          row: 5,
          seat: 11,
          price: 500,
        },
      ];

      mockOrderService.createOrder.mockResolvedValue(mockResult);
      const result = await controller.createOrder(orderData);
      const expectedResponse: OrderResponseDto = {
        total: 2,
        items: mockResult,
      };

      expect(result).toEqual(expectedResponse);
      expect(result.total).toBe(2);
      expect(result.items).toEqual(mockResult);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
      expect(service.createOrder).toHaveBeenCalledWith(orderData.tickets);
    });

    it('проверяем создание заказа с одним билетом', async () => {
      const orderData: CreateFullOrderDto = {
        email: 'single@example.com',
        phone: '+79991111111',
        tickets: [
          {
            film: 'film2',
            session: 'session2',
            daytime: '2024-11-03T20:00:00Z',
            row: 3,
            seat: 5,
            price: 600,
          },
        ],
      };

      const mockResult: OrderResultDto[] = [
        {
          id: 'order_456',
          film: 'film2',
          session: 'session2',
          daytime: '2024-11-03T20:00:00Z',
          row: 3,
          seat: 5,
          price: 600,
        },
      ];

      mockOrderService.createOrder.mockResolvedValue(mockResult);
      const result = await controller.createOrder(orderData);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('order_456');
      expect(result.items[0].film).toBe('film2');
    });

    it('проверяем что контроллер передаёт только tickets в сервис, а не весь orderData', async () => {
      const orderData: CreateFullOrderDto = {
        email: 'test@mail.com',
        phone: '+79995555555',
        tickets: [
          {
            film: 'film3',
            session: 'session3',
            daytime: '2024-11-04T15:00:00Z',
            row: 1,
            seat: 1,
            price: 400,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue([
        {
          id: 'order_789',
          ...orderData.tickets[0],
        },
      ]);

      await controller.createOrder(orderData);
      expect(service.createOrder).toHaveBeenCalledWith(orderData.tickets);
      const callArgs = mockOrderService.createOrder.mock.calls[0][0];
      expect(callArgs).toEqual(orderData.tickets);
    });
  });
});
