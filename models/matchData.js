const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const MatchData = sequelize.define(
  "match_data",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    box_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    prediction: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    matched_time: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    distance: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    sync: {
      type: Sequelize.INTEGER,
      allowNull: true,
  },
  },
  { timestamps: false }
);

module.exports = MatchData;
