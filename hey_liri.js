require('dotenv').config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require('axios')
const moment = require('moment');
const readline = require('readline');
const fs = require('fs');
var option = "";

moment().format();
var spotify = new Spotify(keys.spotify);



function askUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question(question, (answer) => { 
        console.log(answer);
        if(answer.length > 0 && answer !== ""){
            performActions(answer);
        }else {
            askUser(question);
        }
        
        rl.close();
      });
}

var mainActions = "\t* concert-this  <artist/band name here>\n \t* spotify-this-song <song name here>\n \t* movie-this <movie name here>\n \t* do-what-it-says\n" 

//Initial Greetings
askUser("Hello! What can I do for you? \n Here are some options: \n " + mainActions);
 
function performActions(answer) {
    let arr =  answer.split(" ");
    let action  = arr[0].toLowerCase();
    let criteria = arr.slice(1).join(" ");
    logSearch("----------------------------------------------------------\n");

    logSearch("\n" + answer + "\n");

    switch (action) {               
        case 'concert-this':
            searchBand(criteria);
            break;
        case 'spotify-this-song':
            searchOnSpotify(criteria);
            break;
        case 'movie-this':
            searchMovie(criteria);
            break;
        case 'do-what-it-says':
            random();
            break;
        default:
            break;
    }
 }

 function random(){
     fs.readFile("./random.txt", "utf8", function(err, data){
        let answer = data.replace(",", " ");
        performActions(answer);
     });
 }

function searchOnSpotify(search){

spotify.search({ type: 'track', query: search }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    let arr = data.tracks.items;
    for(var i = 0;  i < arr.length; i++){
        console.log(`Artist:  ${arr[i].album.artists[0].name} Song: ${search}, ${arr[i].album.external_urls.spotify}, Album: ${arr[i].album.name}`);
        logSearch(`Artist:  ${arr[i].album.artists[0].name} Song: ${search}, ${arr[i].album.external_urls.spotify}, Album: ${arr[i].album.name}\n`);
    }
    
    console.log("   ");
    askUser(mainActions);
    });
}

function searchMovie(movie){
  // Performing a GET request
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDBKEY}&t=${movie}`)
  .then(function(response){
    // console.log(response.data); // ex.: { user: 'Your User'}
    // console.log(response.status); // ex.: 200
    console.log(`Title: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB: ${response.data.Ratings[0].Value}\nRotten Tomatoes: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}`);
    logSearch(`Title: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB: ${response.data.Ratings[0].Value}\nRotten Tomatoes: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}\n`);
    console.log(" ");
    askUser(mainActions);
});  
 
}

function searchBand(band){
    // Performing a GET request
    axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=${process.env.BANDSKEY}`)
    .then(function(response){
        //console.log(response.length)
      let arr = response.data; // ex.: { user: 'Your User'}
      //console.log(response.status); // ex.: 200
      if(response.data.length < 1){
          console.log("more than one concert " + response.data.length);
      }

      for(var i = 0;  i < arr.length; i++){
          console.log(`Venue: ${arr[i].venue.name} ${arr[i].venue.city}, ${arr[i].venue.country} at ${moment(arr[i].datetime).format('LLLL')}\n` );
          logSearch(`Venue: ${arr[i].venue.name} ${arr[i].venue.city}, ${arr[i].venue.country} at ${moment(arr[i].datetime).format('LLLL')}\n`);
          
      }
      console.log("   ");
      askUser(mainActions);
    });  
  }

  function logSearch(content){
    fs.appendFile('log.txt', content, function (err) {
        if (err) throw err;
      }); 
  }
