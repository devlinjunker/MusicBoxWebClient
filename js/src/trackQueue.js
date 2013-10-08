// Track Queue Service, holds the Queue that is currently being displayed

musicBox.service(
    'trackQueue',
function(){
    // noSong object, containing the information to display if no track is playing.
    this.noSong = {
        Title: "No Song Playing",
        Length: 0
    };

    // Current Playing Track object
    this.currentTrack = this.noSong;

    // Array to hold the track queue
    this.queue = [];

    this.history = [];

    // Adds the trackData to the queue array. Sets the current track if it is
    // the only track in the queue.
    this.addTrack = function(trackData){
        console.log('track added');

        this.queue.push(trackData);

        console.log({ "queue" : this.queue, "history" : this.history});
    }

    // Removes the track at the top of the queue. Sets the next track as the
    // current track, unless the queue is now empty and sets the next track as
    // the noSong
    this.nextTrack = function(){
        console.log('next track')

        if(this.queue[0] != this.noSong){
            var startedTrack = this.queue.shift();

            this.history.push(startedTrack);

            this.currentTrack = startedTrack;
        }

        console.log({ "queue" : this.queue, "history" : this.history});
    }

    // Method to check if the track queue has no tracks in it, returns true if
    // empty and false otherwise
    this.emptyQueue = function(){
        if(this.currentTrack == this.noSong)
            return true;
        else
            return false;
    }

    this.setHistory = function(songList){
        console.log(songList[songList.length-1])
        this.currentTrack = songList[songList.length-1];
        this.history = songList;
    }
});