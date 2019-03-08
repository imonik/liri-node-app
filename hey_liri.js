require('dotenv').config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require('axios')
const moment = require('moment');
const readline = require('readline');

moment().format();
var spotify = new Spotify(keys.spotify);

// var spotify = new Spotify({
//     id: process.env.SPOTIFY_ID,
//     secret: process.env.SPOTIFY_SECRET
// });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var mainActions = "\t* concert-this  <artist/band name here>\n \t* spotify-this-song <song name here>\n \t* movie-this <movie name here>\n \t* do-what-it-says\n" 
  //Initial Greetings

askUser("Hello! What can I do for you? \n Here are some options: \n " + mainActions);
 
function performActions(answer) {
    let arr =  answer.split(" ");
    let action  = arr[0].toLowerCase();
    let criteria = arr.slice(1).join(" ");

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
            console.log("look in spotify");
            break;
        default:
            break;
    }
 }


  function askUser(question) {
    rl.question(question, (answer) => { 
        console.log("primero aqui " + answer);
        performActions(answer);
        rl.close();
      });
  }

function searchOnSpotify(search){

spotify.search({ type: 'track', query: search }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    console.log("--------THE SONGs--------")
    console.log(data.tracks.items[0].album); 
    let arr = data.tracks.items;
    for(var i = 0;  i < arr.length; i++){
        console.log(`Artist:  ${arr[i].album.artists[0].name} Album: ${arr[i].album.name}, ${arr[i].album.external_urls.spotify}`); //${arr[i].items.artist}, ${arr[i].items.name}, ${arr[i].items.preview_url}\n` );
    }
    });
}

function searchMovie(movie){
  // Performing a GET request
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDBKEY}&t=${movie}`)
  .then(function(response){
    console.log(response.data); // ex.: { user: 'Your User'}
    console.log(response.status); // ex.: 200
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
      }

    });  
  }
