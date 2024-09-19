import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CommonEnum } from 'src/common/common.enum';

describe('ImageService', () => {
  let imageService: ImageService;
  const testFileName = 'test.png';
  let createdName = '';
  const testFilePath = path.join('test/test-file', testFileName);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
    }).compile();

    imageService = module.get<ImageService>(ImageService);

    try {
      await fs.access(testFilePath, fs.constants.F_OK);
    } catch (error) {
      throw new Error(
        `Test file '${testFileName}' not found at '${testFilePath}'`,
      );
    }
  });

  describe('createFileImages', () => {
    it('should create a file and return the file name', async () => {
      const image: any = {
        originalname: testFileName,
        buffer: await fs.readFile(testFilePath),
      };
      createdName = await imageService.createFileImages(image);
      expect(createdName).toBeDefined();
      expect(typeof createdName).toBe('string');
      const createdFilePath = path.join(
        CommonEnum.FILES_IMAGES_PATH,
        createdName,
      );
      const fileExists = await fs.access(createdFilePath, fs.constants.F_OK);
      expect(fileExists).toBe(undefined);
    });
    it('should return null if no image provided', async () => {
      const fileName = await imageService.createFileImages(null);
      expect(fileName).toBeNull();
    });
  });

  describe('getFileByName', () => {
    it('should return base64-encoded image content', async () => {
      const base64Image = await imageService.getFileByName(createdName);
      expect(base64Image).toContain('data:image/png;base64,');
    });
  });

  describe('deleteFileByName', () => {
    it('should delete the specified file', async () => {
      let fileExistsAfterDeletion = true;
      const filePath = path.join(CommonEnum.FILES_IMAGES_PATH, createdName);
      await imageService.deleteFileByName(createdName);
      try {
        await fs.access(filePath, fs.constants.F_OK);
      } catch (error) {
        fileExistsAfterDeletion = false;
      }
      expect(fileExistsAfterDeletion).toBe(false);
    });
  });
});
