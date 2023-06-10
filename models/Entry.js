const mongoose = require("mongoose");
const crypto = require("crypto-js");
const config = require("../config");

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
  encrypted: {
    type: Boolean,
    default: false,
  },
});

entrySchema.pre("save", function (next) {
  if (!this.isModified("pages")) return next();
  try {
    this.pages = this.pages.map((page) =>
      crypto.AES.encrypt(page, config.encryptionKey)
    );
    this.encrypted = true;
    return next();
  } catch (err) {
    return next(err);
  }
});
  
entrySchema.methods.decryptedPages = function () {
  return this.encrypted
    ? this.pages.map((page) =>
        crypto.AES.decrypt(page, config.encryptionKey).toString(crypto.enc.Utf8)
      )
    : this.pages;
};

module.exports = mongoose.model("Entry", entrySchema);
