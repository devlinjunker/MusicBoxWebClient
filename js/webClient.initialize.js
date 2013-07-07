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
         alert(code + ": " + reason)
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
            alert('test');
            this.session.subscribe(channelUri, eventHandler);
        }
    };

    webClient.sendMessage = function(msgType, args)
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
            alert("The websocket is closed");
        }
    }

    webClient.sendPlayMessage = function()
    {
        alert("play");
        webClient.sendMessage("PlayTrack", "PlayTrack");
    }

    webClient.sendPauseMessage = function()
    {
        alert("pause");
        webClient.sendMessage("PauseTrack", "PauseTrack");
    }

    webClient.sendSkipMessage = function()
    {
        alert("skip");
        webClient.sendMessage("NextTrack", "NextTrack");
    }

    return webClient;

})(client);
