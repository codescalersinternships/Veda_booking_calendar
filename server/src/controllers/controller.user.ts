import { config } from './../config/config';
import bcrypt from 'bcrypt';
import { db } from '../models';
import jwt from 'jsonwebtoken';
import { Model } from 'sequelize';
import { SignupBody, UserApiData, ResponseType } from '../utils/types';
import { saveUser } from '../middlewares/middleware.user';
import { Request, Response } from 'express';

const User: any = db.users;

// Signing a user up
// Hashing users password before its saved to the database with bcrypt
export const signup = async (req: Request, res: Response<ResponseType>) => {
  try {
    saveUser(req, res);
    const data: SignupBody = req.body;
    if (!data.email) {
      return res.send({ message: 'Email is required.', status: 400 });
    } else if (!data.password) {
      return res.send({ message: 'Password is required.', status: 400 });
    } else {
      data.password = await bcrypt.hash(data.password, 10);
      const user = await User.create(data);

      //if user details is captured
      //generate token with the user's id and the secretKey in the env file
      // set cookie with the token generated
      if (user) {
        const token = jwt.sign({ id: user.id }, config.OTHER.JWT_SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log('user', JSON.stringify(user, null, 2));
        console.log(token);
        //send users details
        return res.send({ data: user, message: 'Success registered', status: 201 });
      } else {
        return res.send({ message: 'Details are not correct.', status: 400 });
      }
    }
  } catch (error) {
    console.log('Error while posting a new user due: ', error);
  }
};

export const login = async (
  req: { body: { email: any; password: any } },
  res: {
    cookie: (arg0: string, arg1: any, arg2: { maxAge: number; httpOnly: boolean }) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: string | Model<UserApiData, UserApiData>): any; new (): any };
    };
  },
) => {
  try {
    const { email, password } = req.body;

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        const token = jwt.sign({ id: user.id }, config.OTHER.JWT_SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log('user', JSON.stringify(user, null, 2));
        console.log(token);
        //send user data
        return res.status(201).send(user);
      } else {
        return res.status(401).send('Authentication failed');
      }
    } else {
      return res.status(401).send('Authentication failed');
    }
  } catch (error) {
    console.log(error);
  }
};
