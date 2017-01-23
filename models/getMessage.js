const util = require('util')
var moment = require('moment');
moment().format();
//	Returns the custom message with the result of YP-API
var getMessage = function(itemFilter, coordinates, callback){

queryYellowAPI(itemFilter, coordinates, function(data){
	var obj = JSON.parse(data);
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

			openingText = "Unfortunately, they're now closed. ";
			if(openingHours)
			{
				//	Setting the opening hours as Moment dates
				for(var i=0; i<openingHours.length; i++){
					openingHoursMoment[i] = moment(openingHours[i].dowFrom + ' ' + openingHours[i].hourFrom ,"ddd HH:mm")

					//	So the days are not from previous week
					openingHoursMoment[i].add(1, 'week');
				}

				var timeFromNow = openingHoursMoment[0].fromNow();
				var nextOpen = openingHoursMoment[0];
				for(var i = 0; i<openingHoursMoment.length; i++){
					if(openingHoursMoment[i].fromNow() < timeFromNow)
					{
						timeFromNow = openingHoursMoment[i].fromNow();
						nextOpen = openingHoursMoment[i];
					}
				}
				openingText += "They will open at " + nextOpen.format('dddd HH:mm') + ".\n";
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


		var returnString = 'Hey, ' + businessName + ' has what you\'re looking for. ' + openingText + merchantUrl;
	}
	else
	{
		var returnString = "We could't find what anything close :/";
	}
	callback(returnString);
});

function queryYellowAPI(item, coordinates, callback){
var http = require("http");
console.log("Here's the coordinates: " + coordinates + '\n');
var options = {
  "method": "POST",
  "hostname": "hackaton.ypcloud.io",
  "path": "/search",
  "headers": {
    "content-type": "application/json"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
	//var parsed = JSON.parse(body);
    //console.log(body.toString());
	//console.log(JSON.parse(body).version);
	console.log(body);
	callback(body);


  });
});

//	Query
req.write(JSON.stringify({ search:
   [ {
       where: { type: 'GEO', value: coordinates },
       collection: 'MERCHANT',
       language: 'EN',
       context: 'CONTENT-R',
		what: item,
	   results: [ { type: 'ROOT', from: 0, count: 1 } ]
		} ] }));

req.end();
}
}

module.exports.getMessage = getMessage;
