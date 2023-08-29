import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * verify jwt token for authorization
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userId = (decodedToken as any).userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: error });
  }
};
