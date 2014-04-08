// Track Queue Service, holds the Queue that is currently being displayed

musicBox.factory(
    'device', 
function(socketSession){//,musicBoxSession){
	var socket = socketSession;

    return function(device){
        this.DeviceName = device.DeviceName;
        this.ID = device.ID;

        this.deviceUri = device.deviceUri;

        this.state = device.Playing;

        this.Location = device.Location;
        this.ThemeID = device.ThemeID;
        this.ThemeFull = device.ThemeFull;
        this.User = device.User;

        this.queue = [];
        this.history = [];

        this.themeList = [];

//        musicBoxSession.getTrackHistory(this.ID).then(this.setHistory);
		socket.call("http://www.musicbox.com/trackHistory", [this.ID],
		function(result){
			this.setHistory(result);
		});

        this.currentSong = undefined;

        /*
         * Adds the trackData to the queue array. Sets the current track if it is
         * the only track in the queue.
         */
        this.addTrack = function(trackData, playing){
            console.log('track added');

            this.queue.push(trackData);
        }

        /*
         * Removes the track at the top of the queue. Sets the next track as the
         * current track, unless the queue is now empty and sets the next track as
         * the noSong
         */
        this.nextTrack = function(){
            if(this.queue[0] !== undefined){
                console.log('next track')

                var startedTrack = this.queue.shift();

                this.currentSong = startedTrack;

                this.history.push(startedTrack);
            }else{
                this.currentSong == undefined;
                if(this.ThemeFull.Type == 0){
                    this.state = 1;
                }
            }
        }

        /*
         * Method to check if the track queue has no tracks in it, returns true if
         * empty and false otherwise
         */
        this.queueIsEmpty = function(){
            if(this.queue[0] === undefined)
                return true;
            else
                return false;
        }

        /*
         * Returns true if the device is playing currently, false otherwise
         */
        this.isPlaying = function(){
            if(this.state === 2){
                return true;
            }else{
                return false;
            }
        }

        /*
         * Returns true if the device is paused currently, false otherwise
         */
        this.isPaused = function(){
            if(this.state === 1){
                return true;
            }else{
                return false;
            }
        }

        /*
         * Returns true if the device is offline currently, false otherwise
         */
        this.isOffline = function(){
            if(this.state === 0){
                return true;
            }else{
                return false;
            }
        }

        /*
         * Sets the state of the device (between 0 and 2)
         */
        this.setState = function(state){
            if(state >= 0 && state <= 2){
                this.state = state;
            }
        }

        /*
         * Sets the song history, when the page first loads
         */
        this.setHistory = function(songList){
            this.history = songList;
            this.currentSong = songList[songList.length -1];
        }

        /*
         * Sets the song queue, when the page first loads
         */
        this.setQueue = function(songList){
            this.queue = songList;
        }

        this.getStations = function(){
            var themeList = this.themeList;
            var ThemeID = this.ThemeID;
            var d = this;
			
	        socket.call("http://www.musicbox.com/themes", [],
            //musicBoxSession.getThemes().then(
				function(themes){
	                for(var i in themes){
	                    if(themes[i].ThemeID === ThemeID){
	                        d.ThemeFull = themes[i];
	                    }
	                    themeList.push(themes[i]);
	                }
            	}
			);
        }

        this.setStation = function(stationId){
            if(this.ThemeID !== stationId){
                this.ThemeID = stationId;

				//musicBoxSession.sendChangeStationMessage(this.deviceUri, stationId);

		        var message = {
		            "command": "updateTheme",
		            "data":{
		                "ThemeID": stationId
		            }
		        }

		        socket.publish(this.deviceUri, message, false);
            }
        }

        this.getStations();
    }
});

