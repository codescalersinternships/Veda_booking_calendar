import { authenticateToken } from './../middlewares/middleware.user';
import { Request, Response } from 'express';
import { db } from '../models';
import { ResponseType, UserApiData } from '../utils/types';

const User: any = db.users;

/**
 * Controller class handling user-related operations like get, update and delete.
 */
export class UserController {
  /**
   * Handles get user.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async get(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<UserApiData>, Record<string, any>>> {
    authenticateToken(req, res);
    try {
      const user = await User.findOne({
        where: {
          id: req.params.userId,
        },
      });

      if (user) {
        return res.status(201).send({ data: user, message: 'Success response.', status: 200 });
      }
      return res.status(404).send({ message: `Record not found.`, status: 404 });
    } catch (error) {
      return res.status(400).send({ message: `Error while getting user due:`, status: 400 });
    }
  }
}
