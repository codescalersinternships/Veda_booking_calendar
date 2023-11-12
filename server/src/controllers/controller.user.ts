import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../config/config';
import { db } from '../models';
import { saveUser } from '../middlewares/middleware.user';
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
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      saveUser(req, res);
      const data: SignupBody = req.body;

      // Check if email and password are present in the request body
      if (!data.email) {
        return res.send({ message: 'Email is required.', status: 400 }).status(400);
      } else if (!data.password) {
        return res.send({ message: 'Password is required.', status: 400 }).status(400);
      } else {
        // Hash the password
        data.password = await bcrypt.hash(data.password, 10);
        const user = await User.create(data);

        if (user) {
          // Generate a JWT token
          const token = jwt.sign({ id: user.id }, config.OTHER.JWT_SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });

          // Set the JWT token as a cookie
          res.cookie('access_token', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

          // Send success response
          return res.send({ data: user, message: 'Success registered', status: 201 }).status(201);
        } else {
          // Send an error response if user creation fails
          return res.send({ message: 'Details are not correct.', status: 400 }).status(400);
        }
      }
    } catch (error) {
      console.log('Error while posting a new user due: ', error);
      return res.send({ message: `Error while posting a new user due: ${error}`, status: 403 }).status(403);
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
      const { email, password } = req.body;

      // Find a user by their email
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        // Compare the provided password with the hashed password in the database
        const isSame = await bcrypt.compare(password, user.password);

        if (isSame) {
          // Generate a JWT token
          const token = jwt.sign({ id: user.id }, config.OTHER.JWT_SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });

          // Set the JWT token as a cookie
          res.cookie('access_token', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
          return res.send({ data: user, message: 'Success logged in', status: 200 });
        } else {
          // Send an error response if the password is incorrect
          return res.send({ message: 'Authentication failed, The password seems to be not valid.', status: 401 });
        }
      } else {
        // Send an error response if the user is not found
        return res.send({
          message: "Authentication failed, Couldn't find a user with the provided email.",
          status: 401,
        });
      }
    } catch (error) {
      console.log(error);
      return res.send({ message: `Error while authenticating the requested user due: ${error}`, status: 403 });
    }
  }
}
