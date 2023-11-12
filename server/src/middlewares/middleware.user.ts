import { db } from '../models';
import { Request, Response } from 'express';
import { ResponseType } from '../utils/types';

const user: any = db.users;

export const saveUser = async (req: Request, res: Response<ResponseType>) => {
  try {
    const emailcheck = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailcheck) {
      return res.send({ message: 'Authentication failed, Please try to use another email.', status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
};
