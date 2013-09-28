// Track Queue Service, holds the Queue that is currently being displayed

musicBox.service(
    'trackQueue',
function(socketSession, user){
    // noSong object, containing the information to display if no track is playing.
    this.noSong = {
        TrackTitle: "No Song Playing",
        length: "0:00"
    };

    // Current Playing Track object
    this.currentTrack = this.noSong;

    // Array to hold the track queue
    this.queue = [];

    // Adds the trackData to the queue array. Sets the current track if it is
    // the only track in the queue.
    this.addTrack = function(trackData){
        this.queue.push(trackData);

        if(this.queue.length == 1){
            this.currentTrack = trackData;
        }
    }

    // Removes the track at the top of the queue. Sets the next track as the
    // current track, unless the queue is now empty and sets the next track as
    // the noSong
    this.nextTrack = function(){
        if(this.queue[0] != this.noSong){
            var removed = this.queue.shift();

            if(this.queue.length == 0)
                this.currentTrack = this.noSong;
            else
                this.currentTrack = this.queue[0];
        }
    }

    // Method to check if the track queue has no tracks in it, returns true if
    // empty and false otherwise
    this.isEmpty = function(){
        if(this.currentTrack == this.noSong)
            return true;
        else
            return false;
    }
});