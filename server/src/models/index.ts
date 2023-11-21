import { defineUserTable } from './user.model';
import { defineBoatTable } from './boat.model';
import { defineRequestTable } from './request.model';

import { Sequelize } from 'sequelize';
import { config } from './../config/config';
import { Database } from '../utils/types';

const sequelize = new Sequelize(
  `postgres://${config.DATABASE.USER}:${config.DATABASE.PASSWORD}@${config.DATABASE.HOST}:${config.DATABASE.PORT}/postgres`,
);

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to veda`);
  })
  .catch(err => {
    console.log(err);
  });

export const db: Database = {
  sequelize: sequelize,
  users: defineUserTable(sequelize),
  boats: defineBoatTable(sequelize),
  requests: defineRequestTable(sequelize),
};

export const synchronizeAndConnectDatabase = () => {
  if (db && db.sequelize) {
    //synchronizing the database and forcing it to false so we dont lose data.
    db.sequelize.sync({ force: false }).then(() => {
      console.log('db has been re sync');
    });
  }
};
