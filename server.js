// index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3030;
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const proxy = require("./routes/proxyRoute");
var multer = require("multer");
var upload = multer();
var compression = require("compression");
// app.use(express.json());
const cors = require("cors");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static("public"));
app.disable("etag");
app.use(compression({ level: 6 }));
var morgan = require("morgan");

app.use(cors());

app.use(morgan("tiny"));

app.use("/", proxy);

app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

sequelize
  .sync()
  // .sync()
  .then((result) => {
    app.listen(port, "0.0.0.0", () => {
      console.log(
        `RESTful API server ${process.pid} running on http://localhost:${port}`
      );
    });
  });
