// MusicBoxSession Service, Manages the current music box, sends

musicBox.factory(
    'musicBoxSession',
function(user, socketSession){
    // Sets it's socket to the Apps Socket Session
    this.socket = socketSession;

    // Holds the Device Uri of the Current Device
    this.deviceUri = undefined;

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
    this.setDeviceUri = function(deviceName){

        this.deviceUri = user.deviceUriPrefix + deviceName;
    }

    // Changes the current device uri
    this.changeDevice = function(newDeviceId, newDeviceName, oldDeviceId, oldDeviceName){
        this.unsubscribeDevice(oldDeviceId, oldDeviceName);

        this.deviceUri = user.deviceUriPrefix + newDeviceId;
        this.subscribeDevice(newDeviceId, newDeviceName)
        this.getStatusUpdate(newDeviceName);
    }

    // Unsubscribes from the device given in the parameters
    this.unsubscribeDevice = function(deviceId, deviceName){
        var uri = user.deviceUriPrefix + deviceName;
        if(this.deviceUri != undefined)
            this.socket.unsubscribe(this.deviceUri);
    }

    // Subscribes to the device specified in the parameters, hooks the invokeCallbacks
    // method to the device
    this.subscribeDevice = function(deviceId, deviceName){

        this.socket.subscribe(this.deviceUri, this.invokeCallbacks);
    }

    // Requests a status updated from the deviceName specified
    this.getStatusUpdate = function (deviceName){
        socketSession.call(this.deviceUri + "/currentQueueRequest",
            {
                username: user.name,
                password: user.password,
                playerTitle: deviceName
            },
            function(result){
                console.log("update requested")
            },
            function(){}
        );
    }

    // Sends the 'Skip Track' message to the current device
    this.sendSkipTrackMessage = function(){
        var message = {
            "command": "nextTrack"
        }

        this.socket.publish(this.deviceUri, message, false);
    }

    return this;
});