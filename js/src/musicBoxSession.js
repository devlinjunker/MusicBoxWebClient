musicBox.factory('musicBoxSession', function(user, socketSession){
    this.socket = socketSession;
    var callbacks = [];

    this.deviceUri = undefined;

	// Sets the Device URI using the device name and user's device prefix
    this.setDeviceUri = function(deviceName){
        this.deviceUri = user.deviceUriPrefix + deviceName;
    }

    this.sendSkipTrackMessage = function(){
        var message = {
            "command": "nextTrack"
        }

        this.socket.publish(this.deviceUri, message, false);
    }

    this.changeDevice = function(newDeviceId, newDeviceName, oldDeviceId, oldDeviceName){
        this.unsubscribeDevice(oldDeviceId, oldDeviceName);

        this.deviceUri = user.deviceUriPrefix + newDeviceName;
        this.subscribeDevice(newDeviceId, newDeviceName)
        this.getStatusUpdate(newDeviceName);
    }

    this.unsubscribeDevice = function(deviceId, deviceName){
        var uri = user.deviceUriPrefix + deviceName;
        if(this.deviceUri != undefined)
            this.socket.unsubscribe(this.deviceUri);
    }

    this.subscribeDevice = function(deviceId, deviceName){
        console.log(this.deviceUri)
        this.socket.subscribe(this.deviceUri, this.invokeCallbacks);
    }

    this.invokeCallbacks = function(topicUri, event){
        for(i in callbacks){
            console.log(callbacks[i])
            callbacks[i](topicUri, event);
        }
    }

    this.addCallback = function(callback){
        callbacks.push(callback)
    }

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

    return this;
});