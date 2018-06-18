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
    constructor(artist, name, id) {
        this.artist = artist;
        this.name = name;
        this.id = id;
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
            localStorage.setItem("ultimatePlaylist", JSON.stringify(ultimatePlaylist)); //Save it to localStorage
        }
    },
    
    addTrack: function(title, name, id) {
        const ultimatePlaylist = JSON.parse(localStorage.getItem('ultimatePlaylist'));
        let newTrack = new track(title, name, id)
        ultimatePlaylist.push(newTrack) //Push the track to the ultimatePlaylist array
        localStorage.setItem("ultimatePlaylist", JSON.stringify(ultimatePlaylist)); //Save it to localStorage
    },

    removeTrack: function(id) {
        const ultimatePlaylist = JSON.parse(localStorage.getItem('ultimatePlaylist'));

        //Get the index of the song to delete based on its unique id
        var index = ultimatePlaylist.findIndex(function(element){return element.id === id}) 
        
        ultimatePlaylist.splice(index, 1); 
        //When deleted from the array, update localstorage
        localStorage.setItem("ultimatePlaylist", JSON.stringify(ultimatePlaylist));
        location.reload() 
    }
}

const displayController = {

    search: function(data) {
        
        let displaySearchedResult = document.getElementById("searchResults");
        let content = `<h2>Search results</h2> `; 
        for (let track of data) {
            let title = track.title
            let id = track._id;

            for(let artist of track.artists) {
                let name = artist.name
                
                content += `
                <li>${title} - ${name}<button onclick="handleTracks.addTrack(this.dataset.title, this.dataset.name, this.id)" 
                data-title="${title}" data-name="${name}" id="${id}" class="btn btn-outline-primary add-track-button">Add track</button></li>
                `; 
                displaySearchedResult.innerHTML = content;
            }   
        }
    },
    
    playlist: function() {
        const ultimatePlaylist = JSON.parse(localStorage.getItem('ultimatePlaylist'));
        const playlists = document.getElementById("playlists");
        let content = ``;
        
        for ( let song of ultimatePlaylist ) {
            
            content += `
            <li>${song.artist} - ${song.name} <button id="${song.id}" onclick="handleTracks.removeTrack(this.id)" 
            class="btn btn-outline-danger delete-track-button">Remove track</button> </li> 
            `
        }
        playlists.innerHTML = content;
    }
}


//const factText = document.querySelector('#factText');
const nameInput = document.querySelector('#search-form');

nameInput.addEventListener('input', getFactFetch);

    // RÅ DATA Api
    function getFactFetch(){
        let name = nameInput.value;
        
        if(name.length >= 3){
          fetch('https://folksa.ga/api/tracks?limit=1000&key=flat_eric')
          .then(response => response.json())
          .then( data => {
          	data = data.filter( ( element ) => {
              return new RegExp( name, 'ig' ).test( element.title)

            } );
            displayController.search(data);
          })
          .catch(err => console.log(err)); 
        }
      }


//Launch localStorage-check
handleTracks.checkLocalStorage()
displayController.playlist()