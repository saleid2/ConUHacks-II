assert = require('assert');

var insertDocuments = function(db, data, callback) {
  var collection = db.collection('tweets');
  collection.insert([
    data
  ], function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

module.exports.insertDocuments = insertDocuments;
