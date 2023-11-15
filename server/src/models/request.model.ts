import { Sequelize, DataTypes } from 'sequelize';
import { BookingStatus } from '../utils/types';

export const defineRequestTable = (sequelize: Sequelize) => {
  return sequelize.define(
    'requests',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      boatId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'boats', key: 'id' },
      },
      // boat: {
      //   type: DataTypes.JSON,
      //   allowNull: false,
      //   references: { model: 'boats', key: 'id' },
      // },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: { isDate: true },
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: { isDate: true },
      },
      endStr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startStr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPerson: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalFee: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      depositFee: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        defaultValue: BookingStatus.NotSet,
        values: [BookingStatus.NotSet, BookingStatus.Request, BookingStatus.Tentative, BookingStatus.deposit],
        allowNull: true,
      },
    },
    { timestamps: true, freezeTableName: true },
  );
};
