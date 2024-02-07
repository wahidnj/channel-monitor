const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const TRP = sequelize.define(
  "trp_data",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    hash: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sync: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    matched: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = TRP;
