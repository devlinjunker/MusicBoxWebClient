// MusicBoxSession Service, Manages the current music box, sends

musicBox.factory(
    'musicBoxSession',
function(user, socketSession, $q){
    // Sets it's socket to the Apps Socket Session
    this.socket = socketSession;

    this.currentDevice = undefined;
    this.isSubscribed = false;

    // Array to hold the registered callbacks for messages
    var callbacks = [];

    // Function that invokes any callbacks that are registered. Called whenever
    // a message is recieved on the subscribed channel
    this.invokeCallbacks = function(topicUri, event){
        for(i in callbacks){
            console.log(callbacks[i])
            callbacks[i](topicUri, event);
        }
    }

    // Adds a callback to the registered callbacks list, to be called when a
    // message is recieved
    this.addCallback = function(callback){
        callbacks.push(callback)
    }

	// Sets the Music Box Session's Device URI using the device name and
    // the user's device prefix
    this.setCurrentDevice = function(deviceDetails){
        this.currentDevice = deviceDetails;
    }

    // Changes the current device uri
    this.changeDevice = function(newDeviceDetails){
        if(this.currentDevice !== undefined)
            this.unsubscribeDevice(this.currentDevice.DeviceUri);

        this.currentDevice = newDeviceDetails;

        if(this.currentDevice !== undefined)
            this.subscribeDevice(newDeviceDetails.DeviceUri);
        //this.getStatusUpdate(newDeviceName);
    }

    // Unsubscribes from the device given in the parameters
    this.unsubscribeDevice = function(deviceUri){
        this.socket.unsubscribe(deviceUri);
        this.isSubscribed = false;
    }

    // Subscribes to the device specified in the parameters, hooks the invokeCallbacks
    // method to the device
    this.subscribeDevice = function(deviceUri){
        this.isSubscribed = true;
        this.socket.subscribe(deviceUri);
    }

    // Sends the 'Skip Track' message to the current device
    this.sendSkipTrackMessage = function(){
        var message = {
            "command": "nextTrack"
        }

        this.socket.publish(this.deviceUri, message, false);
    }

    this.getTrackHistory = function(){
        var deferred = $q.defer();

        var args = [
            this.currentDevice.ID,
            5
        ];

        this.socket.call("http://www.musicbox.com/trackHistory", args,
            function(result){
                console.log(result);

            }
        )

        return deferred.promise;
    }

    this.getThemes = function(){
        var deferred = $q.defer()

        this.socket.call("http://www.musicbox.com/themes", [],
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

    return this;
});