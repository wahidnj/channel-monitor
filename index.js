const child_process = require("child_process");
const express = require("express");
const WebSocket = require("ws");
const http = require("http");
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

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app).listen(8080, () => {
  console.log("Listening...");
});

const wss = new WebSocket.Server({
  server: server,
});

app.use((req, res, next) => {
  console.log("HTTP Request: " + req.method + " " + req.originalUrl);
  return next();
});

app.use(express.static(__dirname + "/template"));

wss.on("connection", (ws, req) => {
  // Ensure that the URL starts with '/rtmp/', and extract the target RTMP URL.
  //   let match;
  //   if (!(match = req.url.match(/^\/rtmp\/(.*)$/))) {
  //     ws.terminate(); // No match, reject the connection.
  //     return;
  //   }
  console.log("A new client connected");
  ws.send(JSON.stringify({ message: "Welcome New Client" }));
  status = "ON";
  // JSON.stringify({ event: "update", payload: updateData.data })

  //   const rtmpUrl = decodeURIComponent(match[1]);
  //   console.log("Target RTMP URL:", rtmpUrl);

  // When data comes in from the WebSocket, write it to FFmpeg's STDIN.
  ws.on("message", (msg) => {
    console.log("received: %s", msg);
    ws.send("Got: " + msg);
  });

  // If the client disconnects, stop FFmpeg.
  ws.on("close", (e) => {
    // ffmpeg.kill("SIGINT");
    console.log("Connection Closed");
  });
  ws.on("error", console.error);
});

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("PING");
      const data = { message: "PING" };
      client.send(JSON.stringify({ event: "PING", payload: data })); // send the message to all connected clients
    } else {
      console.log("CANT SEND PING");
    }
  });
}, 20000);

app.get("/template", (req, res) => {
  try {
    res.sendFile(path.resolve(__dirname, "./template/index9.html"));
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.get("/template4", (req, res) => {
  try {
    res.sendFile(path.resolve(__dirname, "./template/index11.html"));
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.get("/template2", (req, res) => {
  try {
    res.sendFile(path.resolve(__dirname, "./template/index7.html"));
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.get("/template3", (req, res) => {
  try {
    res.sendFile(path.resolve(__dirname, "./template/index6.html"));
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.get("/camera_status", (req, res) => {
  try {
    console.log("cam_status:" + status);
    if (status == "ON") {
      console.log("SENDING STATE 0");
      sendMessage(0, 0);
    }
    res.json({ status: status });
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.get("/get_info", (req, res) => {
  try {
    if (last_unique_id) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("message"); // send the message to all connected clients
        }
      });
      console.log("browser_status:" + last_unique_id);
      last_unique_id = null;
      res.json({ status: "YES", state: 1 });
    } else {
      res.json({ status: "NO", state: 1 });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.post("/cam_result", async (req, res) => {
  try {
    console.log(req.query);
    // console.log(req.body.result[1]);
    if (req.query.status) {
      status = "OFF";
      date = new Date();
      last_unique_id = uuidv4();
      if (req.query.status == -1) {
        sendMessage(req.query.status, 0);
        setTimeout(function () {
          console.log("SETTING STATUS OFF");
          status = "ON";
        }, 8000);
      } else if (req.query.status == 0) {
        sendMessage(req.query.status, 0);
      } else if (req.query.status == 1) {
        sendMessage(req.query.status, 0);
      } else if (req.query.status == 2) {
        sendMessage(req.query.status, 0);
      } else if (req.query.status == 4) {
        sendMessage(req.query.status, 0);
      } else if (req.query.status == 3) {
        console.log(req.body.result);
        var ageGroup = req.body.result[1];

        var ageGroup = ageGroup == "male" ? 3 : ageGroup == "female" ? 2 : 0;
        console.log(ageGroup);
        sendMessage(req.query.status, ageGroup);
      }
    }

    res.json({ message_id: last_unique_id });
  } catch (err) {
    console.log(err.message);
    res.json({ message_id: err.message });
  }
});

app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

async function sendMessage(status, ageGroup) {
  // JSON.stringify({ event: "update", payload: updateData.data })
  console.log("in send message");
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const data = { status: "YES", state: status, ageGroup: ageGroup };
      client.send(
        JSON.stringify({ event: "cam_status_update", payload: data })
      ); // send the message to all connected clients
    } else {
      console.log("COnnection ELse");
    }
  });
}
