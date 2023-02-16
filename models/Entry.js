const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Date",
  },
  pages: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Entry", entrySchema);
