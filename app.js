//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");
const session = require("express-session")
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { urlencoded } = require("body-parser");
const { log } = require("console");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Logos')));
app.use(express.static(path.join(__dirname, 'background')));

mongoose.set("strictQuery", false);

app.use(session({
    secret: "Out little Secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect(`mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0.5nu8yr2.mongodb.net/userDB`, { useNewUrlParser: true });

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {useNewUrlParser: true}, process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// const secret = process.env.SECRET;

// console.log(process.env.SECRET);

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


let logName = false;
let username = "";

app.get("/", function (req, res) {
    // console.log(process.env.SECRET);
    res.render("content", { label: logName ? username : "Get Started" });
});

app.get("/content",function(req,res){
    if(req.isAuthenticated()){
        res.render("content", { label: logName ? username : "Get Started" });
    }else{
        res.redirect("/login");
    }
})

app.get("/contact", function (req, res) {
    res.render("contact", { label: logName ? username : "Get Started" });
});

app.get("/navbar", function (req, res) {
    res.render("navbar", { label: logName ? username : "Get Started" });
});

app.get("/about", function (req, res) {
    res.render("about", { label: logName ? username : "Get Started" });
});

app.get("/signup", function (req, res) {
    res.render("signup", { label: logName ? username : "Get Started", headName: logName });
});

app.get("/login", function (req, res) {
    res.render("login", { label: logName ? username : "Get Started", headName: logName  });
});

app.get("/bitcoin", function (req, res) {
    res.render("bitcoin", { label: logName ? username : "Get Started" });
});

app.get("/etherium", function (req, res) {
    res.render("etherium", { label: logName ? username : "Get Started" });
});

app.get("/tether", function (req, res) {
    res.render("tether", { label: logName ? username : "Get Started" });
});

app.get("/binance", function (req, res) {
    res.render("binance", { label: logName ? username : "Get Started" });
});

app.get("/errorpage", function (req, res) {
    res.render("errorpage", { label: logName ? username : "Get Started" });
});

app.get("/chart", function (req, res) {
    console.log(req.body.coin);


    https.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false", function (response) {
        const coinArray = [];
        response.on("data", function (data) {
            coinArray.push(data);
        });
        response.on("end", function () {
            const data = Buffer.concat(coinArray);
            let gotCoin = JSON.parse(data);

            // console.log(gotCoin);
            res.render("chart", { gotCoin: gotCoin, label: logName ? username : "Get Started" });
        });
    });






});


app.post("/signup", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
     if(err){
         console.log(err);
         res.redirect("/signup");
     }
     else {
         passport.authenticate("local")(req,res,function(){
             res.redirect("/content");
         });
     }
    });
 });

 app.post("/login", function(req,res){
    const user = new User({
     username: req.body.username,
     password: req.body.password
    });
 
    req.login(user, function(err){
     if(err){
        console.log(err);
     }else{
         passport.authenticate("local")(req,res,function(){
             res.redirect("/content");
         });
     }
    });
 });

app.post("/", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at server 3000");
})