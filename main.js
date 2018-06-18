//Class & constructor for our fetches with methods for specific or general requests
class getData {
    constructor(limit){
        this.limit = limit;
        this.baseUrl = "https://folksa.ga/api/tracks";
        this.key = "key=flat_eric";
    }
    General() {
        return fetch(this.baseUrl + "?limit=" + this.limit + "&" + this.key)
        .then((response) => response.json())
    }
    Specific(id) {
        return fetch(this.baseUrl + this.type + "/" + id + "?" + this.key)
        .then((response) => response.json())
    }

}

//Class & Constructor for creating tracks to the ultimatePlaylist
class track {
    constructor(artist, name) {
        this.artist = artist;
        this.name = name;
    }
}

//Creating a module to handle tracks and localStorage
const handleTracks = {

    checkLocalStorage: function() {
        //this is the first thing thats bound to happen when loading the site
        //check if there are tracks saved in localStorage, if not create the playlist and a track as an example
        const ultimatePlaylist = JSON.parse(localStorage.getItem('ultimatePlaylist'));

        if(ultimatePlaylist) {
            console.log("there is a playlist saved!!")
        } else {
            const ultimatePlaylist = []; //Define ultimatePlaylist that will collect all the tracks
            var newTrack = new track("Artist", "Song name"); //Construct a new example track
            ultimatePlaylist.push(newTrack) //Push the track to the ultimatePlaylist array

            localStorage.setItem("ultimatePlaylist", JSON.stringify(ultimatePlaylist)); //Save it to localStorage
        }
    },
}

const displayController = {

    search: function() {
        

    }

}


//var factText = document.querySelector('#factText');
var nameInput = document.querySelector('#search-form');

nameInput.addEventListener('input', getFactFetch);

    // RÅ DATA Api
    function getFactFetch(){
        var name = nameInput.value;
        
        if(name != ''){ //3
          fetch('https://folksa.ga/api/tracks?limit=1000&key=flat_eric')
          .then(response => response.json())
          .then( data => {
          	data = data.filter( ( element ) => {
              return new RegExp( name, 'ig' ).test( element.title)

            } );
            console.log(data);
          })
          .catch(err => console.log(err)); 
        }    
      }


//Launch localStorage-check
handleTracks.checkLocalStorage()