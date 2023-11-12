import { Sequelize, DataTypes } from 'sequelize';
import { BookingStatus } from '../utils/types';

export const defineRequestTable = (sequelize: Sequelize) => {
  return sequelize.define(
    'requests',
    {
      boat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'boats', key: 'id' },
        validate: { isNumeric: true },
      },
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
        allowNull: false,
      },
      startStr: {
        type: DataTypes.STRING,
        allowNull: false,
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
