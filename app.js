//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://admin-shantanu:" +
    process.env.MONGOOSE +
    "@cluster0.t9vhn.mongodb.net/userDB",
  { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result === true) {
              res.render("secrets");
            }
          });
        } else {
          console.log("user not found");
        }
      } else {
        console.log(err);
      }
    });
  });
app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save(function (err) {
        if (!err) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 6000.");
});
