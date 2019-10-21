var express = require("express");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");

var app = express();
var port = process.env.PORT || 3000

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public"));