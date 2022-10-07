const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({
  day: Number,
  month: Number,
  year: Number,
});

module.exports = new mongoose.model("Date", dateSchema);
