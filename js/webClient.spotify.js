var client = (function(webClient){
    if(webClient == null) webClient = {};

    var searchUri = "http://ws.spotify.com/search/1/track";
    var trackLookupUri = "http://ws.spotify.com/lookup/1/";

    webClient.spotify = {};

    webClient.spotify.search = function(request, resultCallback){
        var encoded_query = encodeURIComponent(request.term);

        //console.log(request);
        $.get(searchUri,
            {
                q: encoded_query,
                page: 1
            },
            function(data, textStatus, jqXHR)
            {
                var results = new Array();

                for(var i = 0; i < 10; i++)
                {
                    track = data.tracks[i];
                    results.push({label:track["name"], value: track["href"]});
                }

                if(resultCallback != null)
                    resultCallback(results);
            },
            "json"
        );
    };

    webClient.spotify.lookupTrack = function(uri, callback){
        var result = null;
        $.get(trackLookupUri,
            {
                uri: uri
            },
            function(data, textStatus, jqXHR)
            {
                callback(data);
            }
        );
    }

    return webClient;

})(client);