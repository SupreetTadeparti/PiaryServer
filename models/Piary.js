const mongoose = require("mongoose");

const piarySchema = new mongoose.Schema({
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    },
  ],
  color: {
    type: [Number],
    default: [111, 196, 248],
  },
});

module.exports = mongoose.model("Piary", piarySchema);
