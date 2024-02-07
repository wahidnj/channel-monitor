const Sequelize = require("sequelize");
const sequelize = require("../util/database2");

const GoodKnightLogs = sequelize.define(
  "good_knight_logs",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    user: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    uptime: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = GoodKnightLogs;
