import { Request, Response } from 'express';
import { db } from '../models';
import { ResponseType, RequestBody, BookingStatus } from '../utils/types';

const Request: any = db.requests;

/**
 * Controller class handling request-related operations like request and cancel request.
 */
export class RequestController {
  /**
   * Handles post request.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async post(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    const data: RequestBody = req.body;

    try {
      if (!data.boat) {
        return res.status(400).send({ message: 'Boat ID is required.', status: 400 });
      } else if (!data.start) {
        return res.status(400).send({ message: 'Start-Date is required.', status: 400 });
      } else if (!data.end) {
        return res.status(400).send({ message: 'End-Date is required.', status: 400 });
      } else {
        data.status = BookingStatus.NotSet;
        const request = await Request.create(data);
        if (request) {
          return res.status(201).send({ data: request, message: 'Success requested.', status: 201 });
        }
        return res.status(400).send({ message: `Error while posting a new request due:`, status: 400 });
      }
    } catch (error) {
      console.log('Error while posting a new request due: ', error);
      return res.status(400).send({ message: `Error while posting a new request due: ${error}`, status: 400 });
    }
  }
  /**
   * Handles get request.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async get(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const request = await Request.findOne({
        where: {
          id: req.params.requestId,
        },
      });

      if (request) {
        return res.status(201).send({ data: request, message: 'Success response.', status: 201 });
      }
      return res.status(404).send({ message: `Record not found.`, status: 404 });
    } catch (error) {
      return res.status(400).send({ message: `Error while getting request due:`, status: 400 });
    }
  }
}
