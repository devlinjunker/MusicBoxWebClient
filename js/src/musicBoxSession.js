// MusicBoxSession Service, Manages the current music box, sends

musicBox.service(
    'musicBoxSession',
function(socketSession, $q, device){

    var socket = socketSession;

    var currentDevice = undefined;

    var callbacks = [];
    var currentCallbacks = [];

	var nearbyDevices = [];

    /*
     * Sets the device that the user is focusing on, so the interface can be
     * updated when a message comes in (current Callbacks are fired to do this)
     */
    this.setCurrentDevice = function(deviceDetails){
        currentDevice = deviceDetails;

        if(deviceDetails !== undefined){
            this.getTrackHistory(currentDevice.ID).then(function(tracks){
                currentDevice.setHistory(tracks);
            });
        }
    }

    /*
     *  Returns the current device so it can be manipulated by a controller
     */
    this.getCurrentDevice = function(){
        return currentDevice;
    }

    /*
     * Subscribes to the device specified in the parameters, hooks the invokeCallbacks
     * method to the device
     */
    this.subscribeDevice = function(deviceUri){
        console.log(deviceUri)
		socket.subscribe(deviceUri, this.invokeCallbacks);
    }
	
	this.unsubscribeDevice = function(deviceUri){
		socket.unsubscribe(deviceUri);
	}


    /*
     * Callback Methods
     */

    /*
     * Invokes the callbacks that are registered for any messaage. Called whenever
     * a message is recieved on a subscribed channel
     */
    this.invokeCallbacks = function(topicUri, event){
        console.log('incoming event')

        for(i in callbacks){
            callbacks[i](topicUri, event);
        }

        if(currentDevice !== undefined && topicUri === currentDevice.deviceUri){
            for(i in currentCallbacks){
                currentCallbacks[i](topicUri, event);
            }
        }
    }

    /*
     * Adds a callback to the registered callbacks list, to be called when any
     * message is recieved
     */
    this.addCallback = function(callback){
        callbacks.push(callback)
    }

    /*
     * Adds a callback to the registered callbacks for the current Device, to be
     * called only when a message is recieved on the current Device channel
     */
    this.addCurrentDeviceCallback = function(callback){
        currentCallbacks.push(callback);
    }


    /*
     * Event Message Calls
     */

    /*
     * Sends the Add Track message on the socket with the data from the track
     * provided to the current device
     *
     * Track Fields:
     *      Title, ArtistName, ArtworkURL, ProviderID, Length, Date
     */
    this.sendAddTrackMessage = function(track){
        var message = {
            "command": "addTrack",
            "data" : [
                {
                    Title: track["Title"],
                    ArtistName: track["ArtistName"],
                    AlbumName: track["AlbumName"],
                    ArtworkURL: track["ArtworkURL"],
                    ProviderID: track["ProviderID"],
                    Length: track["Length"],
                    "Date": new Date().toISOString()
                }
            ]
        }

        socket.publish(currentDevice.deviceUri, message, false);
    }


    /*
     * Sends the 'Skip Track' message to the current device
     */
    this.sendSkipTrackMessage = function(){
        var message = {
            "command": "nextTrack"
        }

        socket.publish(currentDevice.deviceUri, message, false);
    }

    /*
     * Sends the 'Play Track' message to the current device
     */
    this.sendPlayTrackMessage = function(){
        var message = {
            "command": "playTrack"
        }

        socket.publish(currentDevice.deviceUri, message, false);
    }

    /*
     * Sends the 'Pause Track' message to the current device
     */
    this.sendPauseTrackMessage = function(deviceUri){
        var message = {
            "command": "pauseTrack"
        }

        socket.publish(currentDevice.deviceUri, message, false);
    }

    this.sendChangeStationMessage = function(deviceUri, stationId){
        var message = {
            "command": "updateTheme",
            "data":{
                "ThemeID": stationId
            }
        }

        socket.publish(deviceUri, message, false);
    }

	this.sendSetVolumeMessage = function(deviceUri, volume){
		if(volume < 0 || volume > 100){
			return;
		}
		
		var message = {
			"command": "setVolume",
			"data":{
				"Volume": volume
			}
		}
		
		socket.publish(deviceUri, message, false);
	}

    /*
     * RPC Calls (Returns Deferred Promises)
     */

    /*
     * Requests the Track History of the specified device from the server,
     * if no device specified, gets history of the current device
     */
    this.getTrackHistory = function(deviceId){
        var deferred = $q.defer();

        if(deviceId !== undefined){
            id = deviceId
        }


        var args = [
            id
        ];
		
        socket.call("http://www.musicbox.com/trackHistory", args,
            function(result){
				console.log(result)
                deferred.resolve(result);
            }
        )

        return deferred.promise;
    }

    /*
     *  Requests the list of themes from the server
     */
    this.getThemes = function(){
        var deferred = $q.defer()

        socket.call("http://www.musicbox.com/themes", [],
            function(result){
                console.log('themes:')
                console.log(result);

                deferred.resolve(result)
            }
        );

        return deferred.promise;
    }

    // To be used later to get devices to display on home page
    this.getNearbyDevices = function(){
        var deferred = $q.defer()

        socket.call("http://www.musicbox.com/getNearbyDevices", [],
            function(result){
                console.log('nearby:')
                console.log(result);

                var boxes = [];
                for(i in result){
                    var box = result[i].box;
                    box.deviceUri = result[i].uri;
					
					boxes.push(new device(box));
					
					//this.subscribeDevice(box.deviceUri);
                }
				
				nearbyDevices = boxes;

                deferred.resolve(boxes);
            }
        );

        return deferred.promise;
    }
	
	/*
	 * Takes an array of devices and returns true if one of them is online, 
	 * otherwise it returns false
	 */
	this.hasOnlineDevice = function(devices){
		var ret = false;

		if(devices != undefined && devices.length != undefined){
			for(i in devices){
				if(!devices[i].isOffline()){
					ret = true;
				}
			}
		}
		
		return ret;
	}


	var handleMessages = function(topic, event){
		console.log(topic)
        for(i in nearbyDevices){
            if(nearbyDevices[i].deviceUri == topic){
                switch(event.command){
                    case "boxConnected":
                        nearbyDevices[i].state = 1;
                        break;
                    case "boxDisconnected":
                        nearbyDevices[i].state = 0;
                        break;
                    case "startedTrack":
                        nearbyDevices[i].addTrack(event.data.track);
                        nearbyDevices[i].nextTrack();
                        nearbyDevices[i].state = 2;
                        break;
                    case "playTrack":
                        nearbyDevices[i].state = 2;
                        break;
                    case "pauseTrack":
                        nearbyDevices[i].state = 1;
                        break;
                    case "nextTrack":
                    case "endOfTrack":
                        nearbyDevices[i].nextTrack();
                        break;
                    case "addTrack":
                        for(i in event.data){
                            nearbyDevices[i].addTrack(event.data[i]);
                        }
                        break;
                }
            }
        }
    }
	
	this.addCallback(handleMessages);
});