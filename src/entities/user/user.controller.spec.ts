import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Readable } from 'typeorm/platform/PlatformTools';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImageService } from 'src/services/image/image.service';
import { MessageService } from 'src/services/message/message.service';
import { User } from './entity/user.entity';

describe('UserController', () => {
  let userController: UserController;
  const userId = new ObjectId();
  const testFile: Express.Multer.File = {
    fieldname: 'avatar',
    originalname: 'avatar.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('...'),
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  };
  const mockUser = {
    _id: userId,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    avatar: 'avatar.jpg',
    createAt: new Date(),
  };
  const createUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    images: testFile,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        ImageService,
        MessageService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: ImageService,
          useValue: {
            createFileImages: jest.fn().mockResolvedValue('avatar.jpg'),
            getFileByName: jest.fn().mockResolvedValue({
              image: Buffer.from('...'),
              fileName: 'avatar.jpg',
            }),
            deleteFileByName: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: MessageService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create a new user with avatar', async () => {
      const result = await userController.create(createUserDto, testFile);

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUserId', () => {
    it('should find user by userId', async () => {
      const result = await userController.findByUserId(userId.toString());

      expect(result).toEqual(mockUser);
    });
  });

  describe('findAvatarByUserId', () => {
    it('should find avatar by userId and return image', async () => {
      const mockResponse: Partial<Response> = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };

      await userController.findAvatarByUserId(
        userId.toString(),
        mockResponse as Response,
      );

      expect(mockResponse.send).toHaveBeenCalled(); // Ensure send method was called
    });
  });

  describe('deleteUserByUserId', () => {
    it('should delete user by userId', async () => {
      const result = await userController.deleteUserByUserId(userId.toString());

      expect(result).toEqual(mockUser);
    });
  });
});
