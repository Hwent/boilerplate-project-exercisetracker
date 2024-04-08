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

app.get("/api/users/:_id/logs", (req, res) => {
  let id = req.params._id;
  let user = users.find((user) => user._id === id);
  let record = exercises.filter((exercise) => exercise._id === id);

  // Filter based on 'from' and 'to' dates if they are provided
  if (req.query.from || req.query.to) {
    let fromDate = req.query.from ? new Date(req.query.from) : new Date(0); // default to 1970-01-01 if no 'from' date is provided
    let toDate = req.query.to ? new Date(req.query.to) : new Date(); // default to current date if no 'to' date is provided
    record = record.filter((exercise) => {
      let exerciseDate = new Date(exercise.date);
      return exerciseDate >= fromDate && exerciseDate <= toDate;
    });
  }

  // Limit the number of logs if 'limit' is provided
  if (req.query.limit) {
    record = record.slice(0, req.query.limit);
  }

  let log = {
    _id: id,
    username: user.username,
    count: record.length,
    log: record.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    })),
  };
  res.json(log);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let id = req.params._id;
  let dateInput = req.body.date;
  let date = dateInput ? new Date(dateInput + "T00:00:00") : new Date();
  let duration = req.body.duration;
  let description = req.body.description;
  let user = users.find((user) => user._id === id);
  let exercise = {
    _id: id,
    username: user.username,
    date: date.toDateString(),
    duration: parseInt(duration),
    description: description,
  };
  exercises.push(exercise);
  res.json(exercise);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
