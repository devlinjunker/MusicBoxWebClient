var client = (function webClient(webClient)
{
    if(webClient == null) webClient = {};

    webClient.connectionEstablished = function(session){
        this.session = session;

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
        if(this.session != null)
        {
            console.log('Subscribing to Channel: '+channelUri);
            this.session.subscribe(channelUri, eventHandler);
        }
    };

    webClient.sendWebsocketMessage = function(msgType, args)
    {
        if(this.session != null)
        {
            var eventDetails = {};

            console.log(msgType);
            console.log(args);
            this.session.publish(channelUri, args, true);
        }
        else
        {
            console.log("Unable to send Message: "+msgType+" args: "+args);
        }
    }

    webClient.sendAddTrackMessage = function(service, serviceId)
    {
        console.log("Send Add :"+service+", "+serviceId);

        var command = "AddTrack,"+service+","+serviceId;

        webClient.sendWebsocketMessage("AddTrack", command);
    }

    webClient.sendPlayMessage = function()
    {
        console.log("Send Play");
        webClient.sendWebsocketMessage("PlayTrack", "PlayTrack");
    }

    webClient.sendPauseMessage = function()
    {
        console.log("Send Pause");
        webClient.sendWebsocketMessage("PauseTrack", "PauseTrack");
    }

    webClient.sendSkipMessage = function()
    {
        console.log("Send Skip");
        webClient.sendWebsocketMessage("NextTrack", "NextTrack");
    }

    webClient.sendRefreshMessage = function()
    {
        console.log("Send Refresh Request");
        //webClient.
    }

    return webClient;

})(client);
