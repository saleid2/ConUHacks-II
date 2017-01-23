# HeyYellowPages
HeyYellow is a twitter bot that sends out cool advices to the #askYP.

## by Git-me-outta-here
This project was made as part of the ConUHacks2017 Hackathon by Git-me-outta-here, team composed of the following members:
* Salim Eid
* Alex Shevchenko
* David Di Feo
* William Bergeron-Drouin.

## Inspiration
The Yellow Pages workshop put on a challenge to design a twitter bot that would read the tweets with
a particular #(askYP) and respond to them with useful proposals, using their Places API.

## What it does
The bot listens for a hashtag and answers user questions using Azure and Yellow Pages' Places API. If it finds
a related business within the Places API, it will answer with the business name, the URL to find the address
(and much more) and even the business hours if they're set.

## How we built it
We divided the tasks into two groups; the main infrastructure and the yellow pages API.

## Challenges we ran into
Twitter API having problems with our session.

## Accomplishments that we're proud of
The bot works!

## What we learned
Yellow Pages API, Azure natural language processing

## What's next for HeyYellow
We are not sure yet.

## Built With
1. PlacesAPI
2. Azure
3. Node.js
4. Moment.js
5. MongoDB
6. Twitter
7. Unirest
