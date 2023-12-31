import { Sequelize, DataTypes } from 'sequelize';
import { UserRole } from '../utils/types';

export const defineUserTable = (sequelize: Sequelize) => {
  return sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: UserRole.USER,
        values: [UserRole.ADMIN, UserRole.USER],
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true, freezeTableName: true },
  );
};
