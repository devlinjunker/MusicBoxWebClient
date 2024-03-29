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
		this.volume = device.Volume;

        this.Location = device.Location;
        this.ThemeID = device.ThemeID;
        this.ThemeFull = device.ThemeFull;
        this.User = device.User;

        this.queue = [];
        this.history = [];

        this.themeList = [];

		// Doesn't work for some reason
		
//        musicBoxSession.getTrackHistory(this.ID).then(this.setHistory);
		// socket.call("http://www.musicbox.com/trackHistory", [this.ID],
// 		function(result){
// 			console.log("history");
// 			console.log(this.history);
// //			setHistory(result);
// 			console.log(this.history);
// 		});
// 		
// 		socket.call("http://www.musicbox.com/queue", [this.ID],
// 		function(result){
// 			console.log("queue");
// 			setQueue(result);
// 		});

//        this.currentSong = undefined;

        /*
         * Adds the trackData to the queue array. Sets the current track if it is
         * the only track in the queue.
         */
        this.addTrack = function(trackData, playing){
			console.log('track added');
			console.log(trackData);
			
			if(trackData.Length == undefined || trackData.Length == -1){
				trackData.Length = "3:41";
			}

			if(this.queue[this.queue.length] != trackData){
				this.queue.push(trackData);
			}
        }

        /*
         * Removes the track at the top of the queue. Sets the next track as the
         * current track, unless the queue is now empty and sets the next track as
         * the noSong
         */
        this.nextTrack = function(){
            if(this.queue.length > 0){
                console.log('next track')
				console.log(this.queue)

                var startedTrack = this.queue[0];
				this.queue = this.queue.slice(1,this.queue.length)
				
				console.log(startedTrack)
				console.log(this.queue)
                this.currentSong = startedTrack;
				
				this.history.push(startedTrack);
            }else{
                this.currentSong == undefined;
                if(this.ThemeFull.Type == 0){
                    this.state = 1;
                }
            }
        }

		this.recentHistoryContains = function(track){
			console.log(this.history)
			for(var i = 0; i < this.history.length && i < 5; i++){
				if(this.history[i].ProviderID == track.ProviderID){
					return true;
				}
			}
			
			return false
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
		setHistory = function(songList){
			console.log(this.history);
			if(songList != undefined){
	            this.history = songList;
	            this.currentSong = songList[songList.length -1];
			
				if(this.currentSong == undefined){
				
				}else if(this.currentSong.Length == undefined || this.currentSong.Length == -1){
					this.currentSong.Length = "4:18";
				}
			}
        }
		this.setHistory = setHistory;

        /*
         * Sets the song queue, when the page first loads
         */
        setQueue = function(songList){
            this.queue = songList;
        }
		this.setQueue = setQueue;

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
		
		
		this.getVolume = function(){
			return this.volume;
		}
		
		this.setVolume = function(volume){
			console.log(volume)
			if(volume < 0 || volume > 100){
				return;
			}
		
			var message = {
				"command": "setVolume",
				"data":{
					"Volume": volume
				}
			}
		
			socket.publish(this.deviceUri, message, false);
			this.volume = volume;
		}

        this.getStations();
    }
});

