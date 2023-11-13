import { Sequelize, DataTypes } from 'sequelize';

export const defineBoatTable = (sequelize: Sequelize) => {
  return sequelize.define(
    'boats',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { timestamps: true, freezeTableName: true },
  );
};
