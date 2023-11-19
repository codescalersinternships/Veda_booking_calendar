import { Request, Response } from 'express';
import { db } from '../models';
import { ResponseType, RequestBody, BookingStatus, RequestPaymentFee } from '../utils/types';
import { Op, Sequelize } from 'sequelize';

const Request: any = db.requests;
const Boat: any = db.boats;

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
        return res.status(201).send({ data: request, message: 'Success response.', status: 200 });
      }
      return res.status(404).send({ message: `Record not found.`, status: 404 });
    } catch (error) {
      return res.status(400).send({ message: `Error while getting request due: ${error}`, status: 400 });
    }
  }
  /**
   * Handles all requests.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async all(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const year = req.query.year;
      const month = req.query.month;
      let requests = [];
      console.log('year && month', year, month);

      if (year && month) {
        requests = await Request.findAll({
          where: {
            [Op.or]: [
              {
                start: {
                  [Op.and]: [
                    Sequelize.literal(`EXTRACT(YEAR FROM "start") = ${year}`),
                    Sequelize.literal(`EXTRACT(MONTH FROM "start") = ${month}`),
                  ],
                },
              },
              {
                end: {
                  [Op.and]: [
                    Sequelize.literal(`EXTRACT(YEAR FROM "end") = ${year}`),
                    Sequelize.literal(`EXTRACT(MONTH FROM "end") = ${month}`),
                  ],
                },
              },
            ],
          },
        });
      } else {
        requests = await Request.findAll();
      }

      for (const request of requests) {
        const boat = await Boat.findOne({
          where: {
            id: request.boatId,
          },
        });
        request.dataValues.boat = boat;

        const fee: RequestPaymentFee = { total: request.totalFee, deposit: request.depositFee };
        request.dataValues.fee = fee;

        // data.totalFee = fee.total;
        // data.depositFee = fee.deposit;
      }
      return res.status(200).send({ data: requests, message: 'Success response.', status: 200 });
    } catch (error) {
      return res.status(400).send({ message: `Error while getting requests due: ${error}`, status: 400 });
    }
  }
  /**
   * Handles update request.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @returns A Promise representing the HTTP response.
   */
  static async put(
    req: Request,
    res: Response<ResponseType>,
  ): Promise<Response<ResponseType<any>, Record<string, any>>> {
    try {
      const data: RequestBody = req.body;
      const start = new Date(data.startStr!);
      const end = new Date(data.endStr!);
      const fee = data.fee;

      if (fee) {
        data.totalFee = fee.total;
        data.depositFee = fee.deposit;
      }

      data.start = start;
      data.end = end;

      await Request.update(data, {
        where: {
          id: req.params.requestId,
        },
      });

      const _request = await Request.findOne(data, {
        where: {
          id: req.params.requestId,
        },
      });

      if (_request) {
        return res.status(201).send({ data: _request, message: 'Success response.', status: 200 });
      }
      return res.status(404).send({ message: `Record not found.`, status: 404 });
    } catch (error) {
      return res.status(400).send({ message: `Error while putting request due: ${error}`, status: 400 });
    }
  }
}
