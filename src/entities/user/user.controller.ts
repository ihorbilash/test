import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { interceptorOptions } from 'src/utils/file-uploadOptions';
import { Response } from 'express';
import { User } from './entity/user.entity';

const COUNT_OF_IMAGE = 1;

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @ApiOperation({ summary: 'Create user' })
  @UseInterceptors(
    FilesInterceptor('images', COUNT_OF_IMAGE, interceptorOptions),
  )
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() file: Express.Multer.File,
  ): Promise<User> {
    try {
      return this.userService.create(createUserDto, file);
    } catch (error) {
      console.error(error);
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'find user by userId' })
  async findByUserId(@Param('userId') userId: string): Promise<User> {
    try {
      return await this.userService.findByUserId(userId);
    } catch (error) {
      console.error(error);
    }
  }

  @Get('user/:userId/avatar')
  @ApiOperation({ summary: 'find user by userId and return Image' })
  async findAvatarByUserId(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.findAvatarByUserId(userId);
      // res.setHeader('Content-Type', 'image/png');
      res.send(data);
    } catch (error) {
      console.error(error);
    }
  }

  @Delete('user/:userId/avatar')
  @ApiOperation({ summary: 'delete user entity' })
  deleteUserByUserId(@Param('userId') userId: string): Promise<User> {
    try {
      return this.userService.remove(userId);
    } catch (error) {
      console.error(error);
    }
  }
}
