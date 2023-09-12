import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * generate test token for the test cases
 *
 * @returns string jwt-token
 */
export const generateTestToken = () => {
  const payload = {
    userId: 'cdda23f9-b48d-42e6-913c-f9cd910363ab',
  };
  console.log(process.env.JWT_SERCRET);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const statusCodes = {
  NOT_FOUND: 10001,
  SUCCESSFUL: 10010,
  INVALID: 10040,
  ERROR: 10090,
  ACCESS_DENIED: 10030,
};
