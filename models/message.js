const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Message = sequelize.define(
  "message_send",
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
    route_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    send_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    msg_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_http: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    retry_call: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    delivery_confirmation: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    customer_confirmation: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    source_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    method: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    c_rate: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    v_rate: {
      type: Sequelize.FLOAT,
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
    prefix: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Message;
