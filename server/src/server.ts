import express from 'express';
import cors from 'cors';
import { router as userRouter } from './routes/route.user';
import { router as requestRouter } from './routes/route.request';
import { router as boatRouter } from './routes/route.boat';
import { db } from './models/';
import { config } from './config/config';

const app = express();

const corsOptions = {
  origin: config.OTHER.VEDA_FRONTEND_DOMAIN,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//synchronizing the database and forcing it to false so we dont lose data

if (db && db.sequelize) {
  db.sequelize.sync({ force: true }).then(() => {
    console.log('db has been re sync');
  });
}

//routes for the user API
app.use('/api/users', userRouter);
app.use('/api/requests', requestRouter);
app.use('/api/boats', boatRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Veda Booking System API.' });
});

app.listen(config.SERVER.PORT, () => {
  console.log(`Server is running on port ${config.SERVER.PORT}.`);
});
