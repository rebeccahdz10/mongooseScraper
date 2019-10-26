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
var articles = ["scrapeBee"];

var db = mongojs(databaseURL, articles);

db.on("error", function (error) {
  console.log("There was an error:", error);
});

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.get("/scrape", function (req, res) {
  axios.get("https://www.newsreview.com/sacramento/home").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".big-news").each(function (i, element) {
      let newBee = {

      }
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

// app.get("/articles", function (req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function (dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function (req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function (dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

