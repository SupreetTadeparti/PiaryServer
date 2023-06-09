require("dotenv").config();

const nodeEnv = process.env.NODE_ENV;
const origin = process.env.ORIGIN;
const encryptionKey = process.env.ENCRYPTION_KEY;
const sessionSecret = process.env.SESSION_SECRET;

module.exports = {
  sessionSecret,
  encryptionKey,
  origin,
  nodeEnv,
};
