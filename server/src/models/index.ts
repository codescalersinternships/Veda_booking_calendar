import { defineUserTable } from './user.model';
import { Sequelize, ModelStatic, Model } from 'sequelize';
import { config } from './../config/config';

type Database = {
  sequelize?: Sequelize;
  users?: ModelStatic<Model<any, any>>;
};

const sequelize = new Sequelize(
  `postgres://${config.DATABASE.USER}:${config.DATABASE.PASSWORD}@${config.DATABASE.HOST}:${config.DATABASE.PORT}/${config.DATABASE.NAME}`,
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
};
