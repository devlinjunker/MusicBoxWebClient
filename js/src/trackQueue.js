musicBox.service('trackQueue', function(socketSession, user){
    this.noSong = {
        TrackTitle: "No Song Playing",
        length: "0:00"
    };

    this.currentTrack = this.noSong;

    this.queue = [];

    this.addTrack = function(data){
        console.log("track added in trackQueue!")
        console.log(data)
        this.queue.push(data);

        console.log(this.queue.length)

        if(this.queue.length == 1){
            this.currentTrack = data;
        }
    }

    this.nextTrack = function(){
        console.log('test')
        if(this.queue[0] != this.noSong){
            var removed = this.queue.shift();

            if(this.queue.length == 0)
                this.currentTrack = this.noSong;
            else
                this.currentTrack = this.queue[0];
        }
    }
});