var client = (function(webClient){
    if(webClient == null) webClient = {};

    var authenticateUri = "http://www.last.fm/api/auth/";
    var apiKey = "600be92e4856b530ec9ffaef2906e5a6";


    var getAlbumInfoUri = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&format=json";
    var getTopTracksUri = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&format=json"
    var getSimilarTracksUri = "http://ws.audioscrobbler.com//2.0/?method=track.getsimilar&format=json";

    webClient.lastfm = {};

    webClient.lastfm.getAlbumInfo = function(artist, album, callback){
        console.log("Retrieving Album Info from Last.fm: "+artist+", "+album);

        var albumInfo = null;
        $.get(getAlbumInfoUri,
            {
                api_key: apiKey,
                artist: artist,
                album: album
            },
            function(data, textStatus, jqXHR)
            {
                if(callback != null)
                    callback(data.album);
            }
        );

        // while(albumInfo == null) {}
        // return albumInfo;
    }

    webClient.lastfm.getTopTracks = function(callback){
        $.get(getTopTracksUri,
            {
                api_key: apiKey
            },
            function(data, textStatus, jqXHR)
            {
                console.log("Retrieving Top Tracks from Last.fm");

                if(callback != null && callback != undefined)
                    callback(data);
            }
        );
    }

    webClient.lastfm.getSimilarTracks = function(title, artist, limit, callback){
        $.get(getSimilarTracksUri,
            {
                api_key: apiKey,
                track: title,
                artist: artist,
                limit: limit
            },
            function(data, textStatus, jqXHR)
            {
                console.log("Retrieving Similar Songs");
                console.log(data);

                if(callback != null && callback != undefined)
                    callback(data)
            }
        );
    }


    return webClient;

})(client);