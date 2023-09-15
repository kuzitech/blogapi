import { Request, Response } from 'express';
import { statusCodes } from '../utils';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export default {
  uploadImage: async (req: Request, res: Response) => {
    const file: Buffer = req.file?.buffer as Buffer;
    try {
      if (!req) {
        return res
          .status(400)
          .json({ status: statusCodes.ERROR, error: 'Error! Request failed' });
      }
      const filePath = `assets/${req.file?.originalname}`;
      const stream = await cloudinary.uploader.upload_stream(
        { folder: 'recipes' },
        (err, result) => {
          if (err)
            return res
              .status(400)
              .json({ status: statusCodes.ERROR, error: `Error: ${err}` });
          res.status(200).json({
            status: statusCodes.SUCCESSFUL,
            message: 'Uploaded Successfully',
            remotePath: result?.secure_url,
          });
        }
      );
      streamifier.createReadStream(file).pipe(stream);
    } catch (error) {
      return res.status(500).json({ error: error, status: statusCodes.ERROR });
    }
  },
};
