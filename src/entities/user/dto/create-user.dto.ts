import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ihor', description: 'name' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ronan', description: 'last name' })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'ihor@gmail.com', description: 'email' })
  email: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  images: Express.Multer.File;
}
