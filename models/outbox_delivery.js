const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const OutboxDelivery = sequelize.define(
  "outbox_delivery",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    charge_reverse: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    retry_call: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    msg_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    delivery_confirmation: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    customer_confirmation: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    error_codes: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    message: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = OutboxDelivery;
