//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//MONGOOSE SETUP***********************************
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
//Create User DB schema
const userSchema = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
});


// userSchema.plugin(encrypt, { secret: secretString, encryptedFields: ["password"] });
//create user DB model
const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if (err) {
      //do something
      console.log(err);
    } else {
      //do something else
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);
  //now check that the user and password are valid
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password){
          res.render("secrets");
          console.log(foundUser.password);
        }
      }
    }
  });
});



app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
