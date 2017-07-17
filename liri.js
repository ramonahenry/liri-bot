
//Liri app similar to Siri
var fs = require('fs');
var twitterKeysObject = require('./keys.js');

//media apps
var Twitter = require('twitter');
var Spotify = require('spotify');
//request npm
var Request = require('request');
//keys
var twitterKeys = twitterKeysObject.twitterKeys;

//command argument variables
var argTwo = process.argv[2];
var argThree = process.argv[3];

//var argFour = process.argv[4];

//Get the first argument 
switch (argTwo) {

	
	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		mySpotify(argThree);
		break;

	case 'movie-this':
		movieThis(argThree);
		break;

	case 'do-what-it-says':
		doWhatItSays();
		break;

	// error handling
	default:
		console.log("Invalid Command. Try again");

}

// process  my Tweets
function myTweets() {

	
	var tweetKeys = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	
	tweetKeys.get('statuses/user_timeline', {count: 20, trim_user: false, exclude_replies: true, include_rts: false}, function(error, tweets, response) {

		// error handling
		if (error) return console.log(' Twitter error received: ' + error);

		
		
		for (var i=0; i<tweets.length; i++) {
			logThis(tweets[i].created_at);
			logThis(tweets[i].text);
		}

	
	});


}


function mySpotify(receivedSong) {
	
	var mySong = receivedSong ? receivedSong : 'The Sign Ace of Base';
	
	Spotify.search({ type: 'track', query: mySong }, function(err, data) {
	
		if (err) return console.log('Spotify Error: ' + err);

		//error handling if song is not found
		if (data.tracks.items.length == 0) return (console.log('No such song found!'));

		logThis('Artist Name: ' + data.tracks.items[0].artists[0].name);
		logThis('Song Name: ' + data.tracks.items[0].name);
		logThis('Preview Link: ' + data.tracks.items[0].preview_url);
		logThis('Album Title: ' + data.tracks.items[0].album.name);

	
	});

}

// movie this 
function movieThis(receivedMovie) {

	//default movie to Mr. Nobody
	var reqMovie = receivedMovie ? receivedMovie : 'Mr. Nobody';

	// request  the OMDB API 
	Request("http://www.omdbapi.com/?t=" + reqMovie + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
	//check to see there is an error
		if (!error && response.statusCode === 200) {
    		logThis('Film Title: ' + JSON.parse(body).Title);
    		logThis('Year: ' + JSON.parse(body).Year);
    		logThis('IMDB Rating: ' + JSON.parse(body).imdbRating);
    		logThis('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating);
    		logThis('Country Produced: ' + JSON.parse(body).Country);
    		logThis('Film Language: ' + JSON.parse(body).Language);
    		logThis('Film Plot: ' + JSON.parse(body).Plot);
    		logThis('Actors: ' + JSON.parse(body).Actors);
    		
    		

	// * Title of the movie.
 //   	* Year the movie came out.
 //   	* IMDB Rating of the movie.
 //   	* Rotten Tomatoes Rating of the movie.
 //   	* Country where the movie was produced.
 //   	* Language of the movie.
 //   	* Plot of the movie.
 //   	* Actors in the movie.

  		}

	});

}

//Randome text file will spotify I want it my Way
function doWhatItSays() {

	
	fs.readFile('random.txt', 'utf8', function(error, data) {

	// error handling
		if (error) return console.log ('Error: ' + error);

	
		var dataText = data.split(',');

	// define the function name and argument name
		var userText = dataText[0];
		var userArg = dataText[1];

	
	switch (userText) {
		case 'my-tweets':
			userText = 'myTweets';
			break;
		case 'spotify-this-song':
			userText = 'mySpotify';
			break;
		case 'movie-this':
			userText = 'movieThis';
			break;
		default:
			console.log('Error returned');
	}

	//route arguments 
	eval(userText)(userArg);

	});


}

// log results
function logThis(dataToLog) {
	// log data to console. 
	console.log(dataToLog);

}









