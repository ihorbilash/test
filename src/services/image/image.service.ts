import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CommonEnum } from 'src/common/common.enum';
import * as uuid from 'uuid';

@Injectable()
export class ImageService {
  async createFileImages(image: Express.Multer.File) {
    if (!image) return null;
    const file = Array.isArray(image) ? image[0] : image;
    try {
      const fileName = uuid.v4() + path.extname(file.originalname);
      await fs.writeFile(
        path.join(CommonEnum.FILES_IMAGES_PATH, fileName),
        file.buffer,
      );
      return fileName;
    } catch (error) {
      throw new NotFoundException(`Cant write file => ${error}`);
    }
  }

  async getFileByName(fileName: string): Promise<string> {
    const filePath = path.join(CommonEnum.FILES_IMAGES_PATH, fileName);
    try {
      const ext = path.extname(fileName).slice(1);
      await fs.access(filePath, fs.constants.F_OK);
      const base64Image = await fs.readFile(filePath, 'base64');
      return `data:image/${ext};base64,${base64Image}`;
    } catch (error) {
      throw new NotFoundException(`File not found =>`, error);
    }
  }

  async deleteFileByName(fileName: string) {
    const filePath = path.join(CommonEnum.FILES_IMAGES_PATH, fileName);
    try {
      await fs.access(filePath, fs.constants.F_OK);
      await fs.unlink(filePath);
    } catch (error) {
      throw new NotFoundException(`File not found to delete =>`, error);
    }
  }
}
