import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseType } from '../utils/types';
import { config } from '../config/config';

// Middleware to check for a valid token
export const authenticateToken = (req: Request, res: Response<ResponseType>, next: NextFunction) => {
  console.log(`Request: ${req.method} -> ${req.url}`);

  const authRoutes = ['signin', 'signup', 'requests'];
  const parts = req.url.split('/');
  let authorizedRoute = false;

  for (const part of parts) {
    if (authRoutes.includes(part)) {
      authorizedRoute = true;
    }
  }

  console.log('authorizedRoute', authorizedRoute);
  if (!authorizedRoute) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: 'Unauthorized: Cannot find the access token in headers.', status: 401 });
    }

    jwt.verify(token, config.OTHER.JWT_SECRET_KEY, (err: any, user: any) => {
      if (err) return res.status(403).send({ message: 'Forbidden: Cannot verify the access token.', status: 403 });

      console.log('user', user);
      Reflect.set(req, 'user', user); // corrected the use of Reflect.set
    });
  }

  next();
};

export const requestLogger = (request: Request, response: Response<ResponseType>, next: any) => {
  console.log(`${request.method} url:: ${request.url}`);
  next();
};
