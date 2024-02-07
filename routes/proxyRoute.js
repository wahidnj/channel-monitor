var express = require("express");
var router = express.Router();
const proxy = require("../controllers/proxyController");
const py = require("../controllers/pyController");
const basicAuth = require("../middleware/basicAuth");

router.get("/", (req, res) => res.send(`Welcome to the  API!${process.pid}`));

router.post("/trp-data", basicAuth, proxy.trpData);

router.post("/message_info", proxy.message_postInfo);

router.get("/message_info", proxy.message_getInfo);

router.get(
  "/smpp/:port/:system_id/:password/:destination_addr/:message/:source_addr/:source_npi/:source_ton",
  proxy.smppConnect
);

router.get("/mail/:email/:password", proxy.mail);

router.get(
  "/bulk_sms/:port/:system_id/:password/:destination_addr/:message/:source_addr",
  proxy.smppBulk
);

router.get("/http_query", proxy.httpQuery);

router.get("/firewall", proxy.firewall);

router.post("/asterisk/voice", proxy.voice);

router.get("/custom", proxy.custom);

router.get("/good-knight/check", proxy.gkCheck);

router.post("/good-knight/data", proxy.gkData);

router.post("/good-knight/status-update", proxy.gkStatus);

router.post("/channel-data",basicAuth, proxy.channelData);

router.get("/good-knight/total", proxy.gkTotal);

router.get("/vendor-sms", proxy.vendorSms);

router.post("/cam_result", py.cam_result);

router.get("/template", py.get_webpage);

// router.get("/camera_status", py.cam_status);

// router.get("/get_info", py.get_info);

module.exports = router;
