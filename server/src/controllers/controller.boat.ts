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
  static async post(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<BoatBody>, Record<string, any>>> {
    try {
      const data: BoatBody = req.body;
      if (!data.title || data.title.length === 0) {
        return res.status(400).send({ message: 'Boat title is required.', status: 400 });
      } else if (data.isAvailable === undefined) {
        return res.status(400).send({ message: 'Boat availability must be selected.', status: 400 });
      } else {
        const request = await Boat.create(data);
        console.log('request', request);

        if (request) {
          return res.status(201).send({ data: request, message: 'Success Added New Boat.', status: 201 });
        }
        return res.status(400).send({ message: `Error while posting a new boat due:`, status: 400 });
      }
    } catch (error) {
      console.log('Error while posting a new boat due: ', error);
      return res.status(400).send({ message: `Error while posting a new boat due: ${error}`, status: 400 });
    }
  }
  /**
   * Handles get boat.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async get(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const boat = await Boat.findOne({
        where: {
          id: req.params.boatId,
        },
      });

      if (boat) {
        return res.status(200).send({ data: boat, message: 'Success response.', status: 200 });
      }
      return res.status(404).send({ message: `Record not found.`, status: 404 });
    } catch (error) {
      return res.status(400).send({ message: `Error while getting boat due:`, status: 400 });
    }
  }
  /**
   * Handles all boats.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async all(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const boat = (await Boat.findAll()) || [];
      return res.status(200).send({ data: boat, message: 'Success response.', status: 200 });
    } catch (error) {
      return res.status(400).send({ message: `Error while getting boats due:`, status: 400 });
    }
  }
}
