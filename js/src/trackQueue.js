musicBox.service('trackQueue', function(socketSession, user){
    this.noSong = {
        TrackName: "No Song Playing",
        length: "0:00"
    };

    this.currentSong = this.noSong;

    this.queue = [];

    this.addTrack = function(data){
        console.log("track added in trackQueue!")
        console.log(data)
        this.queue.push(data);
    }

    this.nextTrack = function(){
        if(this.queue[0] !== this.noSong){
            var removed = this.queue.shift();
        }
    }
});