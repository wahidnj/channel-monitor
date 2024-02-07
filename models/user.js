// const { userInfo } = require("os");
const Sequelize = require("sequelize");
const sequelize = require("../util/database");
// const Partner = require("./partner");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    api_key: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

// User.hasMany(Partner,{foreignKey:'vendor'})

module.exports = User;
