const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      gender: {
        type: DataTypes.ENUM({
          values: ["Male", "Female", "Other"],
        }),
        allowNull: false,
      },
      age: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
      }
    },
    {
      tableName: "users",
      // createdAt: false,
      // updatedAt: false,
    },
  );
};
