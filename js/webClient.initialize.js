var client = (function webClient(webClient)
{
    if(webClient == null) webClient = {
        session: null
    };

    webClient.connectionEstablished = function(session){
        webClient.session = session;

        //this.subscribeChannel()
        this.establishPrefixes();
    };

    webClient.mBoxChannelEventHandler = function(topicUri, Event){
        console.log(Event);
    };

    webClient.errorHandler = function(code, reason){
         console.log("Error Connecting Websocket ("+code + "): " + reason)
    };

    webClient.establishPrefixes = function(){
        // if(this.session != null)
        // {
        //     for(prefix in prefixes)
        //     {
        //         this.session.prefix(prefix.word, prefix.uri);
        //     }
        // }
    };

    webClient.subscribeChannel = function(channelUri, eventHandler){
        if(webClient.session != null)
        {
            console.log('Subscribing to Channel: '+channelUri);
            webClient.session.subscribe(channelUri, eventHandler);
        }
    };

    webClient.sendWebsocketMessage = function(msgType, args)
    {
        if(webClient.session != null)
        {
            console.log("Sending "+msgType+" message:");

            var command = {
                "command": msgType,
                "data": args
            };

            console.log(command);


            webClient.session.publish(channelUri, command, true);
        }
        else
        {
            console.log("Unable to send Message: "+msgType+" args: "+args);
        }
    }

    webClient.sendAddTrackMessage = function(service, serviceId)
    {
        console.log("Send Add :"+service+", "+serviceId);


        var track = {
            "url": serviceId,
            "trackName":"",
            "artistName": "",
            "albumName": "",
            "service": service,
        }

        webClient.sendWebsocketMessage("addTrack", [track]);
    }

    webClient.sendPlayMessage = function()
    {
        console.log("Send Play");

        var command = {"command" : "playTrack"};
        webClient.sendWebsocketMessage("playTrack", "");
    }

    webClient.sendPauseMessage = function()
    {
        console.log("Send Pause");
        webClient.sendWebsocketMessage("pauseTrack", "");
    }

    webClient.sendSkipMessage = function()
    {
        console.log("Send Skip");
        webClient.sendWebsocketMessage("nextTrack", "");
    }

    webClient.sendRefreshMessage = function()
    {
        console.log("Request Status");

        var refreshURL = channelUri + "currentQueueRequest";

        if(webClient.session!= null)
        {
            webClient.session.call(refreshURL, userName, password, deviceName);
        }
    }

    webClient.getDeviceList = function(callback){
        console.log("Request Device List")
        var deviceURL = channelUri + "players";

        if(webClient.session!= null)
        {
            webClient.session.call(deviceURL, userName, password).then(callback);
        }
    }

    return webClient;

})(client);
