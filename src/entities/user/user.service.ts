import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from './dto/create-user.dto';
import { MessageService } from 'src/services/message/message.service';
import { ImageService } from 'src/services/image/image.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly messageService: MessageService,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const newDate = new Date();
    try {
      const avatar = await this.imageService.createFileImages(file);
      const createUser: Omit<User, '_id'> = {
        ...createUserDto,
        avatar,
        createAt: newDate,
      };
      const user = this.userRepository.create(createUser);
      await this.userRepository.save(user);
      this.messageService.sendMessage(user);
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async findByUserId(userId: string): Promise<User> {
    try {
      const id = new ObjectId(userId);
      const user = await this.userRepository.findOneBy({ _id: id });
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async findAvatarByUserId(userId: string): Promise<string> {
    try {
      const user = await this.findByUserId(userId);
      return await this.imageService.getFileByName(user.avatar);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(userId: string): Promise<User> {
    try {
      const user = await this.findByUserId(userId);
      if (!user) return null;
      await this.imageService.deleteFileByName(user.avatar);
      return this.userRepository.remove(user);
    } catch (error) {
      console.error(error);
    }
  }
}
