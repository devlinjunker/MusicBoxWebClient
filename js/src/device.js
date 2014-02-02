// Track Queue Service, holds the Queue that is currently being displayed

musicBox.factory(
    'device',
function(musicBoxSession){

    return function(device){

        this.DeviceName = device.DeviceName;
        this.ID = device.ID;

        this.deviceUri = device.deviceUri;

        this.state = device.Playing;

        this.Location = device.Location;
        this.Theme = device.Theme;
        this.ThemeFull = device.ThemeFull;
        this.User = device.User;

        this.queue = [];
        this.history = [];

        musicBoxSession.getTrackHistory(this.ID).then(this.setHistory);

        this.currentSong = undefined;

        // Adds the trackData to the queue array. Sets the current track if it is
        // the only track in the queue.
        this.addTrack = function(trackData, playing){
            console.log('track added');

            this.queue.push(trackData);
        }

        // Removes the track at the top of the queue. Sets the next track as the
        // current track, unless the queue is now empty and sets the next track as
        // the noSong
        this.nextTrack = function(){
            if(this.queue[0] !== undefined){
                console.log('next track')

                var startedTrack = this.queue.shift();

                this.currentSong = startedTrack;

                this.history.push(startedTrack);
            }else{
                this.currentSong == undefined;
                this.state = 1;
            }
        }

        // Method to check if the track queue has no tracks in it, returns true if
        // empty and false otherwise
        this.queueIsEmpty = function(){
            if(this.queue[0] === undefined)
                return true;
            else
                return false;
        }

        this.isPlaying = function(){
            if(this.state === 2){
                return true;
            }else{
                return false;
            }
        }

        this.isPaused = function(){
            if(this.state === 1){
                return true;
            }else{
                return false;
            }
        }

        this.isOffline = function(){
            if(this.state === 0){
                return true;
            }else{
                return false;
            }
        }

        this.setState = function(state){
            if(state >= 0 && state <= 2){
                this.state = state;
            }
        }

        this.setHistory = function(songList){
            this.history = songList;
            this.currentSong = songList[songList.length -1];
        }

        this.setQueue = function(songList){
            this.queue = songList;
        }
    }
});

