var express = require("express");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");

var app = express();
var PORT = process.env.PORT || 3000

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines'
mongoose.connect(MONGODB_URI)

var databaseURL = "scraper";
var articles = ["scrapeAltPress"];

var db = mongojs(databaseURL, articles);

db.on("error", function (error) {
  console.log("There was an error:", error);
});

app.get("/", function (req, res) {
  res.send("If you are seeing this page, it means I couldn't get my routes to work :-(");
});

app.get("/all", function (req, res) {
  db.scrapeAltPress.find({}, function (err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(found);
    }
  });
});

app.get("/reset", function (req, res) {
  db.scrapeAltPress.drop()
  res.send("reset");
});

app.get("/scrape", function (req, res) {
  axios.get("https://www.altpress.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("td-block-span12 div").each(function (i, element) {
      let newPress = {
        title: $(element).find('.entry-title').children('a').attr('title'),
        summary: $(element).find('.td-excerpt').text(),
        image: $(element).find('.entry-thumb').attr('src')
      }
      db.scrapeAltPress.insert({
        newPress: newPress
      })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

    res.send("Scrape Complete");
  });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});