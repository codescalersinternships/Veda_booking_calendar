import jwt from 'jsonwebtoken';
import { db } from '../models';
import { Request, Response } from 'express';
import { ResponseType } from '../utils/types';
import { config } from '../config/config';

const user: any = db.users;

export const saveUser = async (req: Request, res: Response<ResponseType>) => {
  try {
    const emailcheck = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailcheck) {
      return res.status(400).send({ message: 'Authentication failed, Please try to use another email.', status: 400 });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: `Authentication failed, Error while trying to get user due: ${error}.`, status: 400 });
  }
};

// Middleware to check for a valid token
export const authenticateToken = (req: Request, res: Response<ResponseType>) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).send({ message: 'Unauthorized: Cannot find the access token in cookies.', status: 401 });

  jwt.verify(token, config.OTHER.JWT_SECRET_KEY, (err: any, user: any) => {
    if (err) return res.status(403).send({ message: 'Forbidden: Cannot verify the access token.', status: 403 });
    console.log('user', user);
    Reflect.set(req, user, user);
  });
};
