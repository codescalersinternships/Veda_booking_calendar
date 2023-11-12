import express, { Request, Response } from 'express';
import cors from 'cors';
import { router as authRouter } from './routes/route.auth';
import { router as requestRouter } from './routes/route.request';
import { router as boatRouter } from './routes/route.boat';
import { db } from './models/';
import { config } from './config/config';
import { ResponseType } from './utils/types';

const app = express();

const corsOptions = {
  origin: config.OTHER.VEDA_FRONTEND_DOMAIN,
};

if (db && db.sequelize) {
  //synchronizing the database and forcing it to false so we dont lose data
  db.sequelize.sync({ force: true }).then(() => {
    console.log('db has been re sync');
  });
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/requests', requestRouter);
app.use('/api/boats', boatRouter);

app.get('/', (req: Request, res: Response<ResponseType>) => {
  res.json({ message: 'Veda Booking System API.', status: 200 });
});

app.listen(config.SERVER.PORT, () => {
  console.log(`Server is running on port ${config.SERVER.PORT}.`);
});
