var client = (function(webClient){
    if(webClient == null) webClient = {};

    $(document).ready(function(){
        main();
    })

    function main(){
        //initializeInteractions();
        initializeWebsocket();
    }

    function initializeWebsocket(){
        ab.connect(
            "ws://"+musicBox.settings.socketUri+":"+musicBox.settings.port,
            function(session){
                webClient.connectionEstablished(session);

                var handler = webClient.mBoxChannelEventHandler;

                webClient.subscribeChannel(channelUri, handler);
            },
            function(code, reason){
                webClient.errorHandler(code, reason);
            }
        );
    }

})(client);