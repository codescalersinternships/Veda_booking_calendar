import { Request, Response } from 'express';
import { db } from '../models';
import { ResponseType, BoatBody } from '../utils/types';

const Boat: any = db.boats;

/**
 * Controller class handling boat-related operations like create and update boat.
 */
export class BoatController {
  /**
   * Handles post boat.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async create(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const data: BoatBody = req.body;
      console.log('data.isAvailable', data.isAvailable);
      if (!data.title || data.title.length === 0) {
        return res.send({ message: 'Boat title is required.', status: 400 }).status(400);
      } else if (data.isAvailable === undefined) {
        return res.send({ message: 'Boat availability must be selected.', status: 400 }).status(400);
      } else {
        const request = await Boat.create(data);
        console.log('request', request);

        if (request) {
          return res.send({ data: request, message: 'Success requested.', status: 201 }).status(201);
        }
        return res.send({ message: `Error while posting a new boat due:`, status: 400 }).status(400);
      }
    } catch (error) {
      console.log('Error while posting a new boat due: ', error);
      return res.send({ message: `Error while posting a new boat due: ${error}`, status: 400 }).status(400);
    }
  }
}
