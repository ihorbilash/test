import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ObjectId } from 'mongodb';

describe('MessageService', () => {
  let service: MessageService;
  let amqpConnectionMock: Partial<AmqpConnection>;

  beforeEach(async () => {
    amqpConnectionMock = {
      publish: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: AmqpConnection,
          useValue: amqpConnectionMock,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send message to amqpConnection', async () => {
      const userId = new ObjectId();
      const user = {
        _id: userId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        avatar: 'avatar.jpg',
        createAt: new Date(),
      };

      const result = await service.sendMessage(user);

      expect(result).toBe(true);
      expect(amqpConnectionMock.publish).toHaveBeenCalledWith(
        'post',
        'create-post',
        user,
      );
    });
  });
});
