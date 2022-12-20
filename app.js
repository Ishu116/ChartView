//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
// const md5 = require("md5");
const encrypt = require("mongoose-encryption");
const { urlencoded } = require("body-parser");
const { log } = require("console");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Logos')));
app.use(express.static(path.join(__dirname, 'background')));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const secret = "Thisisthesecretofheaddynamics.";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

let logName = false;

app.get("/", function (req, res) {
    res.render("content", { label: "Swarup" });
});

app.get("/contact", function (req, res) {
    res.render("contact", { label: "Swarup" });
});

app.get("/navbar", function (req, res) {
    res.render("navbar", { label: "Swarup" });
});

app.get("/about", function (req, res) {
    res.render("about", { label: "Swarup" });
});

app.get("/signup", function (req, res) {
    res.render("signup", { label: "Swarup" });
});

app.get("/login", function (req, res) {
    res.render("login", { label: "Swarup" });
});

app.get("/bitcoin", function (req, res) {
    res.render("bitcoin", { label: "Swarup" });
});

app.get("/etherium", function (req, res) {
    res.render("etherium", { label: "Swarup" });
});

app.get("/tether", function (req, res) {
    res.render("tether", { label: "Swarup" });
});

app.get("/binance", function (req, res) {
    res.render("binance", { label: "Swarup" });
});

app.get("/errorpage", function (req, res) {
    res.render("errorpage", { label: "Swarup" });
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
            res.render("chart", { gotCoin: gotCoin, label: "Swarup" });
        });
    });






});


app.post("/signup", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            logName = true;
            res.render("content", { label: "Swarup" });
        }
    });
});

app.post("/login", (req, res) => {
    const name = req.body.name;
    const username = req.body.email;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                if (foundUser.password === password) {
                    logName = true;
                    res.render("content", { label: "Swarup" });
                }
                else {
                    res.render("errorpage");
                }
            }
            else {
                res.render("errorpage");
            }
        }
    });
});

app.post("/", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at server 3000");
})