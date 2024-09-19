import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ObjectId } from 'mongodb';
import { ImageService } from 'src/services/image/image.service';
import { MessageService } from 'src/services/message/message.service';
import { Readable } from 'typeorm/platform/PlatformTools';

describe('UserService', () => {
  let userService: UserService;
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
  const mockCreateUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    images: testFile,
  };
  const mockUser = {
    ...mockCreateUserDto,
    _id: userId,
    avatar: 'avatar.jpg',
    createAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user with avatar', async () => {
      const result = await userService.create(mockCreateUserDto, testFile);

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUserId', () => {
    it('should find user by userId', async () => {
      const result = await userService.findByUserId(userId.toString());
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAvatarByUserId', () => {
    it('should find avatar by userId', async () => {
      const result = await userService.findAvatarByUserId(userId.toString());
      expect(result).toEqual({
        image: Buffer.from('...'),
        fileName: 'avatar.jpg',
      });
    });
  });

  describe('remove', () => {
    it('should remove user by userId', async () => {
      const result = await userService.remove(userId.toString());
      expect(result).toEqual(mockUser);
    });
  });
});
