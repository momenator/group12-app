var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var client = new MongoClient();
var db;
var collection;

client.connect("mongodb://***:***@ds049171.mongolab.com:49171/bl-dataset",function(err, db) {
  if(err) {
    console.log(err);
      console.log("> Connection to database failed.");
  } else {
      collection = db.collection("images");
      console.log("> Connection to database succeded.");
  }
});