import express, { Request, Response, Express } from 'express';
import cors from 'cors';

import { router as authRouter } from './routes/route.auth';
import { router as requestRouter } from './routes/route.request';
import { router as boatRouter } from './routes/route.boat';
import { router as userRouter } from './routes/route.user';

import { synchronizeAndConnectDatabase } from './models/';
import { config } from './config/config';
import { ResponseType } from './utils/types';
import { authenticateToken, requestLogger } from './middlewares/middleware.user';

const app = express();

console.log('config.OTHER.VEDA_FRONTEND_DOMAIN', config.OTHER.VEDA_FRONTEND_DOMAIN);

const corsOptions = {
  origin: config.OTHER.VEDA_FRONTEND_DOMAIN,
};

const main = async (app: Express) => {
  try {
    await synchronizeAndConnectDatabase();
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(authenticateToken).use(requestLogger);

    app.use('/api/auth', authRouter);
    app.use('/api/requests', requestRouter);
    app.use('/api/boats', boatRouter);
    app.use('/api/users', userRouter);

    app.get('/', (req: Request, res: Response<ResponseType>) => {
      return res.status(200).send({ message: 'Veda Booking System API.', status: 200 });
    });

    app.listen(config.SERVER.PORT, () => {
      console.log(`Server is running on port ${config.SERVER.PORT}.`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

main(app);
