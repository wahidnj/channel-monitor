const redis = require("redis");
const client = redis.createClient();
// const ioredis = require("ioredis");
// let redisio = new ioredis();
// const axios = require("axios");
// const gatewayPriority = require("./gatewayPriority.js");

module.exports = {
  Customer_Balance: async function (customer_id, rate) {
    async function userBalance(customer_id) {
      return new Promise((resolve, reject) => {
        return client.exists("customer_" + customer_id, function (err, reply) {
          if (reply === 1) {
            client.hgetall("customer_" + customer_id, function (err, object) {
              resolve(object);
            });
          } else {
            resolve("Customer is not valid.....");
          }
        });
      });
    }

    var redis_Data = await userBalance(customer_id);
    var balance = redis_Data.r_balance;
    var current_balance = parseFloat(balance) - parseFloat(rate);
    client.hmset("customer_" + customer_id, {
      r_balance: current_balance,
    });
    return 1;
  },
  Vendor_Balance: async function (vendor_id, vrate) {
    async function vendorBalance(vendor_id) {
      return new Promise((resolve, reject) => {
        return client.exists("vendor_" + vendor_id, function (err, reply) {
          if (reply === 1) {
            client.hgetall("vendor_" + vendor_id, function (err, object) {
              resolve(object);
            });
          } else {
            resolve("vendor is not valid.....");
          }
        });
      });
    }

    var redis_Data = await vendorBalance(vendor_id);
    var balance = redis_Data.vr_balance;
    var current_balance = parseFloat(balance) - parseFloat(vrate);
    client.hmset("vendor_" + vendor_id, {
      vr_balance: current_balance,
    });
    return 1;
  },

  Customer_Balance_Return: async function (customer_id, rate) {
    async function userBalance(customer_id) {
      return new Promise((resolve, reject) => {
        return client.exists("customer_" + customer_id, function (err, reply) {
          if (reply === 1) {
            client.hgetall("customer_" + customer_id, function (err, object) {
              resolve(object);
            });
          } else {
            resolve("Customer is not valid.....");
          }
        });
      });
    }

    var redis_Data = await userBalance(customer_id);
    var balance = redis_Data.r_balance;
    var current_balance = parseFloat(balance) + parseFloat(rate);
    client.hmset("customer_" + customer_id, {
      r_balance: current_balance,
    });
    return 1;
  },

  Vendor_Balance_Return: async function (vendor_id, vrate) {
    async function vendorBalance(vendor_id) {
      return new Promise((resolve, reject) => {
        return client.exists("vendor_" + vendor_id, function (err, reply) {
          if (reply === 1) {
            client.hgetall("vendor_" + vendor_id, function (err, object) {
              resolve(object);
            });
          } else {
            resolve("vendor is not valid.....");
          }
        });
      });
    }

    var redis_Data = await vendorBalance(vendor_id);
    var balance = redis_Data.vr_balance;
    var current_balance = parseFloat(balance) + parseFloat(vrate);
    client.hmset("vendor_" + vendor_id, {
      vr_balance: current_balance,
    });
    return 1;
  },

  Customer_Check_Balance: async function (customer_id, rate) {
    async function userBalance(customer_id) {
      return new Promise((resolve, reject) => {
        return client.exists("customer_" + customer_id, function (err, reply) {
          if (reply === 1) {
            client.hgetall("customer_" + customer_id, function (err, object) {
              resolve(object);
            });
          } else {
            resolve("Customer is not valid.....");
          }
        });
      });
    }

    var redis_Data = await userBalance(customer_id);
    var balance = redis_Data.r_balance;
    if (parseFloat(balance) >= parseFloat(rate)) {
      return true;
    } else {
      return false;
    }
  },

  Vendor_Check_Balance: async function (vendor_id, vrate) {
    async function vendorBalance(vendor_id) {
      return new Promise((resolve, reject) => {
        return client.exists("vendor_" + vendor_id, function (err, reply) {
          if (reply === 1) {
            client.hgetall("vendor_" + vendor_id, function (err, object) {
              resolve(object);
            });
          } else {
            resolve("vendor is not valid.....");
          }
        });
      });
    }

    var redis_Data = await vendorBalance(vendor_id);
    var balance = redis_Data.vr_balance;
    if (parseFloat(balance) >= parseFloat(vrate)) {
      return true;
    } else {
      return false;
    }
  },
};
