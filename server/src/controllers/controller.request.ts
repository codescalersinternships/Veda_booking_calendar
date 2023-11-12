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
  static async request(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    const data: RequestBody = req.body;

    try {
      if (!data.boat) {
        return res.send({ message: 'Boat ID is required.', status: 400 }).status(400);
      } else if (!data.start) {
        return res.send({ message: 'Start-Date is required.', status: 400 }).status(400);
      } else if (!data.end) {
        return res.send({ message: 'End-Date is required.', status: 400 }).status(400);
      } else {
        data.status = BookingStatus.NotSet;
        const request = await Request.create(data);
        if (request) {
          return res.send({ data: request, message: 'Success requested.', status: 201 }).status(201);
        }
        return res.send({ message: `Error while posting a new request due:`, status: 400 }).status(400);
      }
    } catch (error) {
      console.log('Error while posting a new request due: ', error);
      return res.send({ message: `Error while posting a new request due: ${error}`, status: 400 }).status(400);
    }
  }
}
