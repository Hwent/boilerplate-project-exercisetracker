const express = require("express");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

let users = [{ username: "test", _id: "test" }];
let exercises = [];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  let username = req.body.username;
  let id = uuidv4();
  let newUser = { username: username, _id: id };
  users.push(newUser);
  res.json(newUser);
});

app.get("/api/users/:_id/log", (req, res) => {
  let id = req.params._id;
  let user = users.find((user) => user._id === id);
  let record = exercises.filter((exercise) => exercise._id === id);
  let log = {
    username: user.username,
    _id: id,
    count: record.length,
    log: record,
  };
  res.json(log);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let id = req.params._id;
  let date = new Date(req.body.date);
  let duration = req.body.duration;
  let description = req.body.description;
  let user = users.find((user) => user._id === id);
  let exercise = {
    username: user.username,
    _id: id,
    date: date.toDateString(),
    duration: duration,
    description: description,
  };
  exercises.push(exercise);
  res.json(exercise);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
