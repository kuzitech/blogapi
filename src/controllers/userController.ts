import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import db from '../../db';
import { statusCodes } from '../utils';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[$#!@+=\-?()%]).{8,20}$/;

export default {
  /**
   * Register a user
   *
   * @param req Request
   * @param res Response
   * @param next
   * @returns object
   */
  registerUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: 'Parameters are required and cannot be empty' });
    }

    if (!email.match(EMAIL_REGEX)) {
      return res
        .status(400)
        .json({ error: 'Email is invalid', status: statusCodes.INVALID });
    }

    if (!password.match(PASSWORD_REGEX)) {
      return res
        .status(400)
        .json({ error: 'Password is invalid', status: statusCodes.INVALID });
    }

    try {
      const usernameValid = username.match(/^[a-zA-Z]{1,15}$/);
      if (!usernameValid) {
        return res
          .status(400)
          .json({ message: 'Username is invalid', status: statusCodes.ERROR });
      }
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          message: 'Username is not available',
          status: statusCodes.ERROR,
        });
      }
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          message: 'Email already existed and cannot be used',
          status: statusCodes.ERROR,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashedPassword, email };
      await db.one(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
        [newUser.username, newUser.password, newUser.email]
      );
      res.status(201).json({
        message: 'User registered successfully',
        status: statusCodes.SUCCESSFUL,
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while registering the user',
        message: error,
        status: statusCodes.ERROR,
      });
    }
  },

  /**
   * log the user in
   *
   * @param req Request
   * @param res Response
   * @param next
   * @returns object jwt-token
   */
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    try {
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        return res.status(401).json({
          error:
            'Invalid username or password. Check your inputs and try again',
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h',
      });
      // if (!token) {
      //   return res.status(500).json({ error: 'Error while creating token' });
      // }
      res.json({ timespan: '1 hour', token, status: statusCodes.SUCCESSFUL });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  },

  /**
   * find user using the username
   *
   * @param req
   * @param res
   * @returns object user
   */
  findUser: async (req: Request, res: Response) => {
    res.setTimeout(10000);
    const { username } = req.body;

    if (!username || !username.match(/^[a-zA-Z]{1,15}$/)) {
      return res.status(400).json({
        error: 'Username parameter is required or invalid',
        status: statusCodes.INVALID,
      });
    }

    try {
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(404).json({
          error: 'User does not exist',
          status: statusCodes.NOT_FOUND,
        });
      }
      delete user.password;
      return res.status(200).json({ status: statusCodes.SUCCESSFUL, user });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal Server Error', status: statusCodes.ERROR });
    }
  },
};
