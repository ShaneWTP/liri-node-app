
require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require('moment');

var input = process.argv;
var command = process.argv[2];
var argArray = [];

for (var i = 3; i < input.length; i++) {
    argArray.push(input[i]);
    argArray.push("+")
}

argArray.splice(-1);

var userQuery = argArray.join("");

switch (command) {

    case "concert-this":
        concertThis()
        break;

    case "spotify-this-song":
        spotifyThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        whatItSays();
        break;

    default:
        console.log("invalid command")
}


function concertThis() {
    if (userQuery === "") {
        console.log("Artist not found.")
    }
    else {
        axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp").then(
            function (response) {
                if (response.data.length <= 0) {
                    console.log("This artist has no upcoming events. Check back at a later date.")
                }
                else {
                    console.log(response);
                    console.log("--------------EVENTS----------------")
                    for (var i = 0; i < response.data.length; i++) {
                        console.log("\nVenue: " + response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.region + "\nEvent Date: " + moment(response.data[i].datetime).format('LL'));
                        console.log("-------------------------------------")
                    }
                }
            }
        )
    }
}

function spotifyThis() {
    var spotKey = new Spotify(keys.spotify);

    if (userQuery === "") {
        userQuery = "The Sign Ace of Base";
    }
    spotKey.search({ type: 'track', query: userQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Track: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Spotify URL: " + data.tracks.items[0].external_urls.spotify);
    })
}

function movieThis() {
    if (userQuery === "") {
        userQuery = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("-------------------------------------------------------------------------------")
            console.log("Title: " + response.data.Title + "\nRelease Year: " + response.data.Year + "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes Score: " + response.data.Ratings[1].Value + "\nProduction Country: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors);
            console.log("-------------------------------------------------------------------------------");
        }
    );
}


function whatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        userQuery = dataArr[1];
        spotifyThis()
    });
}
