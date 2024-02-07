const axios = require("axios");
const path = require("path");
const fs = require("fs");
var cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
var QRCode = require("qrcode");
var last_unique_id = null;
var status = "ON";
var date = new Date();
var state = 0;

// cron.schedule("*/30 * * * * *", () => {
//   const endDate = new Date();
//   var seconds = (endDate.getTime() - date.getTime()) / 1000;
//   console.log("running a task every 30 second:" + seconds);
//   console.log(seconds);
//   if (status == "OFF" && seconds > 30) {
//     status = "ON";
//   }
// });

module.exports = {
  cam_result: async (req, res, next) => {
    try {
      console.log("cam result:");
      console.log(req.query);
      console.log(req.body);
      status = "OFF";
      date = new Date();
      last_unique_id = uuidv4();
      // QRCode.toString(
      //   "wahid.webrtc.xyz/" + last_unique_id,
      //   { type: "terminal" },
      //   function (err, url) {
      //     console.log("qrcode");
      //   }
      // );
      res.json({ message_id: last_unique_id });
    } catch (err) {
      console.log(err.message);
      res.json({ message_id: err.message });
    }
  },

  get_webpage: async (req, res, next) => {
    try {
      res.sendFile(path.resolve(__dirname, "./../template/index7.html"));
    } catch (err) {
      console.log(err.message);
      res.json({ message_id: err.message });
    }
  },

  cam_status: async (req, res, next) => {
    try {
      console.log("cam_status:" + status);
      res.json({ status: status });
    } catch (err) {
      console.log(err.message);
      res.json({ message_id: err.message });
    }
  },

  get_details: async (req, res, next) => {
    try {
      console.log("cam_status:" + last_unique_id);
      res.json({ status: last_unique_id });
    } catch (err) {
      console.log(err.message);
      res.json({ message_id: err.message });
    }
  },

  get_info: async (req, res, next) => {
    try {
      if (last_unique_id) {
        console.log("browser_status:" + last_unique_id);
        last_unique_id = null;
        res.json({ status: "YES", state: 1 });
      } else {
        res.json({ status: "YES", state: 1 });
      }
    } catch (err) {
      console.log(err.message);
      res.json({ message_id: err.message });
    }
  },
};
