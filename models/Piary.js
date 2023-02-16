const mongoose = require("mongoose");

const piarySchema = new mongoose.Schema({
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    },
  ],
});

module.exports = mongoose.model("Piary", piarySchema);
