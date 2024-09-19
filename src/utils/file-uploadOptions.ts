import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// allow only image
const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(null, false);
  }
  callback(null, true);
};

export const interceptorOptions: MulterOptions = {
  fileFilter: imageFileFilter,
};
