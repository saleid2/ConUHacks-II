var unirest = require('unirest');

//returns the whole response
var analyse = function(text, callback){
  unirest.post('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases')
  .headers({'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': '945f328ba40c415eb780f3562b306926'})
  .send({
    "documents": [
       {
         "id": "string",
         "text": text
       }
    ]
  })
  .end(function (response) {
    console.log(response.body);
    callback(response.body.documents[0].keyPhrases);
  });
}

module.exports.analyse = analyse;
