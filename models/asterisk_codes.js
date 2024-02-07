const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Message = sequelize.define(
  "asterisk_causes",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    asterisk_value: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    causes_codes: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    mfc: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    sip: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    motif: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    defination: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    result: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Message;
