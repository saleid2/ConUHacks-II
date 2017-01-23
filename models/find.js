assert = require('assert');

var findDocuments = function(db, userId, callback) {
  // Get the documents collection
  var collection = db.collection('tweets');
  // Find some documents
  var queryPreparer = "event.user.screen_name"
  collection.find({[queryPreparer]: userId}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(docs);
    callback(docs);
  });
}

module.exports.find = findDocuments;
