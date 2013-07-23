var client = (function(webClient){
    if(webClient == null) webClient = {};

    var searchUri = "http://ws.spotify.com/search/1/track";
    var trackLookupUri = "http://ws.spotify.com/lookup/1/";

    webClient.spotify = {};

    webClient.spotify.search = function(request, resultCallback){
        console.log("Searching Spotify: "+request.term);
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
                    //console.log(track.artists[0].name);
                    results.push(
                        {
                            label: track["name"],
                            value: track["href"],
                            artist: track.artists[0].name,
                            album: track.album.name
                        }
                    );
                }

                if(resultCallback != null)
                    resultCallback(results);
            },
            "json"
        );
    };

    webClient.spotify.lookupTrack = function(uri, callback){
        console.log("Retrieve Spotify Track Info: "+uri)
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