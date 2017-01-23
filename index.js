"use strict";
var Twitter         = require('twitter');
var MongoClient     = require('mongodb').MongoClient,
    assert          = require('assert');
var analyse         = require('./models/analyse').analyse;
var getMessage		  = require('./models/yellow').yellow;
var insert          = require('./models/insertDocuments').insertDocuments;
var find            = require('./models/find').find;
var url             = require('./secrets/mongo').url;
var secret          = require('./secrets/twitter').secret;
var client          = new Twitter(secret);

// You can also get the stream in a callback if you prefer.
var hashTag = 'askYP'
//Look for a the hash tag using the Twitter API.

client.stream('statuses/filter', {track: hashTag}, function(stream) {
  console.log("connected to Twitter");
    stream.on('data', function(event) {
      //Connect and check for errors.
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
      //Check if we got a location
      if (event.geo || event.place) {
          //check for the hash tag and remove it from the string.
          var textWithoutHashTag = event.text.replace("#askYPdtest", '');

          //Run the Analyse function
          //It returns a callback with response which is the important words in the string passed.
          analyse(textWithoutHashTag, function(response) {
            //set the text key in event object to the response we go so we keep important words.
            event.textImp = response
            //set the hasBeenProcessedYet to false so we can check up with the tweet later on.
            event.hasBeenProcessedYet = true;
            //insert to mongodb
            insert(db, {event}, function() {
              db.close();
            });
			//Outputing the tweet
			console.log(event.text + "\nImportant words: " + event.textImp);
			//Run the query with YellowPage api
      if (event.geo != undefined) {
        var place = event.geo.coordinates[0]  + ',' + event.geo.coordinates[1];
      }else if (event.place != undefined) {
        var place = event.place.bounding_box.coordinates[0][0][1]  + ',' + event.place.bounding_box.coordinates[0][0][0];
      }
			getMessage(event.textImp[0], "Montreal", event.user.screen_name, function(message){
        client.post('statuses/update', {status: message, in_reply_to_status_id: event.id_str},  function(error, tweet, response) {
          if(error){
            console.log(error);
          };
          console.log(message);
        });
			});
          });
      }else{
        var message = "Hey @"+event.user.screen_name+" please enable positioning on your device, and try again.";
        client.post('statuses/update', {status: message},  function(error, tweet, response) {
          if(error){console.log(error);};
          console.log("Hey @"+event.user.screen_name+" please enable positioning on your device, and try again.");
        });
      }
    });
  });
  //check for errors.
  stream.on('error', function(error) {
    console.log(error);
  });
});
