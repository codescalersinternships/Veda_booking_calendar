import { UserAuthFormResponse } from './../../../client/src/utils/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../config/config';
import { db } from '../models';
import { SignupBody, ResponseType } from '../utils/types';

const User: any = db.users;

/**
 * Controller class handling user-related operations like signup and signin.
 */
export class UserController {
  /**
   * Handles user signup.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async signup(
    req: Request<any>,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<UserAuthFormResponse>, Record<string, any>>> {
    try {
      try {
        const existingUser = await User.findOne({
          where: {
            email: req.body.email,
          },
        });

        if (existingUser) {
          return res.status(400).send({ message: 'Email is already in use.', status: 400 });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).send({ message: `Error while checking for existing user: ${error}`, status: 400 });
      }

      const data: SignupBody = req.body;

      // Check if email and password are present in the request body
      if (!data.email) {
        return res.status(400).send({ message: 'Email is required.', status: 400 });
      } else if (!data.password) {
        return res.status(400).send({ message: 'Password is required.', status: 400 });
      } else if (!data.firstName) {
        return res.status(400).send({ message: 'First name is required.', status: 400 });
      } else if (!data.lastName) {
        return res.status(400).send({ message: 'Last name is required.', status: 400 });
      } else {
        // Hash the password
        data.password = await bcrypt.hash(data.password, 10);
        const user = await User.create(data);

        if (user) {
          // Generate a JWT token
          const token = jwt.sign({ id: user.id }, config.OTHER.JWT_SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });

          const data = { ...user.dataValues, vedaAccessToken: token };
          // Set the JWT token as a cookie
          // res.cookie('vedaAccessToken', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
          // Send success response
          return res.status(201).send({ data, message: 'Success registered', status: 201 });
        } else {
          // Send an error response if user creation fails
          return res.status(400).send({ message: 'Details are not correct.', status: 400 });
        }
      }
    } catch (error) {
      console.log('Error while posting a new user due: ', error);
      return res.status(403).send({ message: `Error while posting a new user due: ${error}`, status: 403 });
    }
  }

  /**
   * Handles user signin.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async signin(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const data: SignupBody = req.body;
      // Check if email and password are present in the request body
      if (!data.email) {
        return res.status(400).send({ message: 'Email is required.', status: 400 });
      } else if (!data.password) {
        return res.status(400).send({ message: 'Password is required.', status: 400 });
      } else {
        // Find a user by their email
        const user = await User.findOne({
          where: {
            email: data.email,
          },
        });

        if (user) {
          // Compare the provided password with the hashed password in the database
          const isSame = await bcrypt.compare(data.password, user.password);

          if (isSame) {
            // Generate a JWT token
            const token = jwt.sign({ id: user.id }, config.OTHER.JWT_SECRET_KEY, {
              expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            // Set the JWT token as a cookie
            // res.cookie('vedaAccessToken', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            const data = { ...user.dataValues, vedaAccessToken: token };
            return res.status(200).send({ data, message: 'Success logged in', status: 200 });
          } else {
            // Send an error response if the password is incorrect
            return res
              .status(401)
              .send({ message: 'Authentication failed, The password seems to be not valid.', status: 401 });
          }
        } else {
          // Send an error response if the user is not found
          return res.status(401).send({
            message: "Authentication failed, Couldn't find a user with the provided email.",
            status: 401,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(403)
        .send({ message: `Error while authenticating the requested user due: ${error}`, status: 403 });
    }
  }
}
