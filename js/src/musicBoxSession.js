// MusicBoxSession Service, Manages the current music box, sends

musicBox.service(
    'musicBoxSession',
function(socketSession, $q){

    var socket = socketSession;

    var currentDevice = undefined;

    var callbacks = [];
    var currentCallbacks = [];

    /*
     * Sets the device that the user is focusing on, so the interface can be
     * updated when a message comes in (current Callbacks are fired to do this)
     */
    this.setCurrentDevice = function(deviceDetails){
        currentDevice = deviceDetails;

        this.getTrackHistory(currentDevice.ID).then(function(tracks){
            currentDevice.setHistory(tracks);
        })
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
        socket.subscribe(deviceUri, this.invokeCallbacks);
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
        console.log(event)

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
        console.log('callback added')
        callbacks.push(callback)
    }

    /*
     * Adds a callback to the registered callbacks for the current Device, to be
     * called only when a message is recieved on the current Device channel
     */
    this.addCurrentDeviceCallback = function(callback){
        console.log('current callback added');
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
    this.getDevices = function(){

    }

});