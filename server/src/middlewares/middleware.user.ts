import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ResponseType } from '../utils/types';
import { config } from '../config/config';

// Middleware to check for a valid token
export const authenticateToken = (req: Request, res: Response<ResponseType>) => {
  try {
    const token = req.headers.authorization;
    if (!token)
      return res.status(401).send({ message: 'Unauthorized: Cannot find the access token in cookies.', status: 401 });

    jwt.verify(token, config.OTHER.JWT_SECRET_KEY, (err: any, user: any) => {
      if (err) return res.status(403).send({ message: 'Forbidden: Cannot verify the access token.', status: 403 });
      console.log('user', user);
      Reflect.set(req, user, user);
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: `Error while trying to get user token due: ${error}.`, status: 400 });
  }
};
