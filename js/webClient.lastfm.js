var client = (function(webClient){
    if(webClient == null) webClient = {};

    var authenticateUri = "http://www.last.fm/api/auth/";
    var apiKey = "600be92e4856b530ec9ffaef2906e5a6";


    var getAlbumInfoUri = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&format=json";

    webClient.lastfm = {};

    webClient.lastfm.getAlbumInfo = function(artist, album, callback){
        var albumInfo = null;
        $.get(getAlbumInfoUri,
            {
                api_key: apiKey,
                artist: artist,
                album: album
            },
            function(data, textStatus, jqXHR)
            {
                callback(data.album);
            }
        );

        // while(albumInfo == null) {}
        // return albumInfo;
    }



    return webClient;

})(client);