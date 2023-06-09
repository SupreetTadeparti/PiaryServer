const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");

const PORT = 5000;
const DAY = 86400000; // in ms

app.use("/static", express.static(path.join(__dirname, "static")));

app.use(cors({ credentials: true, origin: config.origin }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    cookie: { maxAge: DAY },
    store: new MemoryStore({
      checkPeriod: DAY,
    }),
    saveUninitialized: false,
    resave: false,
    secret: config.sessionSecret,
  })
);

app.use("/api", require("./routes/ApiRouter"));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

mongoose.connect(
  process.env.DB_URL || "mongodb://127.0.0.1:27017/mongodb",
  () => {
    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}`);
    });
  }
);
