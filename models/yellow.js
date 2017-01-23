var unirest = require('unirest');
var moment = require('moment');
moment().format();

//returns the whole response
var yellow = function(what, where, who, callback){
  unirest.post('http://hackaton.ypcloud.io/search')
  .headers({'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': 'XXXXXXXXXXXXXXXXXXXX'}) //API KEY
  .send({
     "search": [
         {
             "what": what,
             "where": {
                 "type": "FREE",
                 "value": where
             },
             "collection": "MERCHANT"
         }
     ]
 }
)
  .end(function (response) {
    var obj = response.body;
    if(obj.searchResult[0].merchants)
    {
      var merchant = obj.searchResult[0].merchants[0];
      var businessName = merchant.businessName;
      var address = merchant.address.displayLine + ", "
            + merchant.city;

      var merchantUrl = merchant.urls.filter(function(item) {
                return item.type == 'YPCA_MERCHANT_PAGE';
              })[0].text;
      var openingText;
      var isOpen = merchant.openNow;
      if(!isOpen){
        var openingHours = merchant.businessHour.openingIntervals;
        var now = moment();
        var openingHoursMoment = [];

        openingText = "They are closed right now. ";
        if(openingHours)
        {
          //	Setting the opening hours as Moment dates
          for(var i=0; i<openingHours.length; i++){
            openingHoursMoment[i] = moment(openingHours[i].dowFrom + ' ' + openingHours[i].hourFrom ,"ddd HH:mm");
            if(openingHoursMoment[i].isBefore(now)){
               openingHoursMoment[i].add(1, 'week');
            }
          }
          var nextOpen = openingHoursMoment[0];
                for(var i = 0; i<openingHoursMoment.length; i++){
                    if(openingHoursMoment[i].isBefore(nextOpen))
                    {
                        nextOpen = openingHoursMoment[i];
                    }
                }
          openingText += "Opens at " + nextOpen.format('ddd HH:mm') + ".\n";
        }
        else
        {
          openingText += "\n";
        }
      }
      else
      {
        openingText = "It's open now!\n";
      }
      var message = 'Hey @'+ who +', ' +  businessName + ' has what you\'re looking for. ' + openingText + merchantUrl;
      if (message.length - merchantUrl.length > 140) {
        var returnString ='Hey @'+ who +', ' +  businessName + ' has what you\'re looking for. ' + merchantUrl;
      }else{
      var returnString ='Hey @'+ who +', ' +  businessName + ' has what you\'re looking for. ' + openingText + merchantUrl;
    }
    }
    else
    {
      var returnString = 'Hey @'+ who +', ' + "we couldn't find anything close :/";
    }
    callback(returnString);
  });
}

module.exports.yellow = yellow;
