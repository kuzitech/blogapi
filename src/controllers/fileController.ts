import { Request, Response } from 'express';
import { statusCodes } from '../utils';

export default {
  uploadImage: (req: Request, res: Response) => {
    try {
      if (!req) {
        return res
          .status(400)
          .json({ status: statusCodes.ERROR, error: 'Error! Request failed' });
      }
      const filePath = `assets/${req.file.originalname}`;

      return res.status(200).json({
        status: statusCodes.SUCCESSFUL,
        message: 'Uploaded Successfully',
        remotePath: filePath,
      });
    } catch (error) {
      return res.status(500).json({ error: error, status: statusCodes.ERROR });
    }
  },
};
