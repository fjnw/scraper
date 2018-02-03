/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");


// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");


// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nyt";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
}); 




//  =================
//       ROUTES
//  =================
//  1.  Delete (article + notes)
//  2.  Scrape (GET)
//  3.  Articles (GET)
//  4.  Articles (GET by ID)
//  5.  Articles (POST save-unsave)
//  6.  Notes (POST add-delete)

// ============= 1. Delete (article + notes) ==============

app.delete("/dump", function(req, res) {

  Article.remove({}).exec(function(){
    console.log("All articles deleted.")
  });

  Note.remove({}).exec(function(){
    console.log("All notes deleted.")
  });
  
});


// ============= 2. SCRAPE (GET) ==============

app.get("/scrape", function(req, res) {

  request("https://www.nytimes.com/", function(error, response, html) {
    
  var $ = cheerio.load(html);

    $("article").each(function(i, element) {

      var result = {};
      result.title = $(this).children("h2").text();
      result.author = $(this).children("p.byline").text();
      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) console.log(err);
        else console.log(doc);
      });
    
    });
  });

  res.send("New York Times articles scraped!");

});


// ============= 3. Articles (GET) ==============

app.get("/articles", function(req, res) {

  Article.find({}, function(error, doc) {
    if (error) console.log(error);
    else res.json(doc);
  });

});


// ============= 4. Aritcle (GET by Id) ==============

app.get("/articles/:id", function(req, res) {

  Article.findOne({ "_id": req.params.id }).populate("note").exec(function(error, doc) {
    if (error) console.log(error);
    else res.json(doc);
  });

});


// ============= 5. Article (POST save-unsave) ==============

app.post("/articles/:action/:id/", function(req, res) {

  var id = req.params.id;
  var boolean = req.params.action;

  if (boolean === "add") boolean = true;
  else if (boolean === "remove") boolean = false;

  Article.findOneAndUpdate({ "_id": id}, { "saved": boolean }).exec(function(err, doc) {
    if (err) console.log(err);
    else res.send(doc);
  });

});


// ============= 6. Note (POST add-delete) ==============

app.post("/note/add/:id", function(req, res) {

  var newNote = new Note(req.body);

    newNote.save(function(error, doc) {
      if (error) console.log(error);
      else {
        Article.findOneAndUpdate({ "_id": req.params.id }, {$push:{ "note": doc }})
        .exec(function(err, doc) {
          if (err) console.log(err);
          else res.send(newNote);
        })
      }
    })
});

app.delete("/note/delete/:id", function(req, res) {

  Note.findOneAndRemove({"_id": req.params.id}, function(err) {
    if (err) console.log("Error deleting note: " + err)
    //else console.log("Note deleted: " + req.params.id);
  });

});
