const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ChannelData = sequelize.define(
  "channel_data",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    hash_image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    channel_name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = ChannelData;
