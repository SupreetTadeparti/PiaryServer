const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Piary = require("../models/Piary");
const Entry = require("../models/Entry");
const DateModel = require("../models/Date");

router.get("/logged-in", (req, res) => {
  if (req.session.user === undefined) {
    res.send({ successful: false, message: "User not in session" });
  } else res.send({ successful: true, message: "User is logged in" });
});

router.get("/get-user", (req, res) => {
  if (req.session.user === undefined) {
    res.send({ successful: false, message: "User not in session" });
  }

  res.send({
    successful: true,
    message: "User is logged in",
    data: req.session.user,
  });
});

router.post("/logout", (req, res) => {
  if (req.session.user === undefined) {
    res.send({ successful: false, message: "User is not logged in" });
  } else {
    delete req.session.user;
    res.send({ successful: true, message: "Successfuly logged out" });
  }
});

router.post("/login", async (req, res) => {
  // finds users with given username and email
  const username = await User.findOne({ username: req.body.username });
  const email = await User.findOne({ email: req.body.username });

  // checks if password matches
  if (
    (username && (await username.validatePassword(req.body.password))) ||
    (email && (await email.validatePassword(req.body.password)))
  ) {
    // adds user to session
    req.session.user = username?.username || email.username;
    req.session.save();
    res.send({ successful: true, message: "Successfully logged in" });
  } else {
    res.send({ successful: false, message: "Invalid username or password" });
  }
});

router.get("/entries", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  const piary = await user.piary.populate("entries");
  const entries = piary.entries;
  for (let entry of entries) {
    entry = await entry.populate("date");
  }
  res.send(entries);
});

router.get("/entry", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  const piary = await user.piary.populate("entries");
  for (let entry of piary.entries) {
    entry = await entry.populate("date");
    if (entry.id == req.query.entryID) {
      res.send({
        title: entry.title,
        pages: entry.pages,
        date: {
          day: entry.date.day,
          month: entry.date.month,
          year: entry.date.year,
        },
      });
      return;
    }
  }
  res.send([]);
});

router.post("/delete", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  const piary = await user.piary.populate("entries");
  piary.entries = piary.entries.filter(
    (entry) => entry._id !== req.body.entryID
  );
  await piary.save();
  Entry.findByIdAndDelete(req.body.entryID, (err) => {
    if (err) console.log(err);
  });
  res.send(true);
});

router.post("/new-entry", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.user }).populate(
      "piary"
    );
    const date = new DateModel({
      day: req.body.date.day,
      month: req.body.date.month,
      year: req.body.date.year,
    });
    date.save();
    const entry = new Entry({
      title: req.body.title,
      date: date,
      pages: req.body.pages,
    });
    entry.save();
    const piary = await user.piary.populate("entries");
    piary.entries.push(entry);
    piary.save();
    user.save();
    res.send({ successful: true, message: "Successfully saved entry" });
  } catch (e) {
    res.send({ successful: false, message: "Failed to save entry" });
  }
});

router.post("/register", async (req, res) => {
  const usernameFound = await User.findOne({ username: req.body.username });
  const emailFound = await User.findOne({ email: req.body.email });

  if (usernameFound !== null) {
    res.send({
      successful: false,
      message: `User with username "${req.body.username}" already exists`,
    });
    return;
  }

  if (emailFound !== null) {
    res.send({
      successful: false,
      message: `User with email "${req.body.email}" already exists`,
    });
    return;
  }

  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const piary = new Piary({});
    user.piary = piary;
    piary.save();
    user.save();
  } catch (e) {
    res.send({
      successful: false,
      message: "Failed to create user",
    });
  }

  res.send({
    successful: true,
    message: "Successfully registered",
  });
});

router.get("/diary-clr", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  res.send({ color: user.piary.color });
});

router.post("/diary-clr", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  user.piary.color = req.body.color;
  user.piary.save();
});

module.exports = router;
