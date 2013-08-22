var client = (function(webClient){
    if(webClient == null) webClient = {};

    var searchUri = "http://ws.spotify.com/search/1/track";
    var trackLookupUri = "http://ws.spotify.com/lookup/1/";

    webClient.spotify = {};

    webClient.spotify.search = function(query, callback){

        var encoded_query = encodeURIComponent(query);

        //console.log(request);
        $.get(searchUri,
            {
                q: encoded_query,
                page: 1
            },
            function(data, textStatus, jqXHR)
            {
                var results = new Array();

                if(data.tracks != undefined)
                {
                    for(var i = 0; i < 10; i++)
                    {
                        var track = data.tracks[i];
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
                }

                console.log("Results:");
                console.log(results);

                if(callback != null)
                    callback(results);
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
                if(callback != null)
                    callback(data);
            }
        );
    }

    webClient.spotify.getServiceId = function(title, artist, album, callback)
    {
        webClient.spotify.search(title, function(results){
            callback(results[0].label);
        })
    }

    return webClient;

})(client);