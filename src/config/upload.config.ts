import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');

const multerOptions: multer.Options = {
  limits: {
    fields: 0,
    files: 1,
    parts: 1,
  },
  storage: multer.diskStorage({
    destination: tmpDirectory,
    filename(_request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
};

export default {
  directory: tmpDirectory,
  multerOptions,
};
