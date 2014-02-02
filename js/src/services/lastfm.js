musicBox.service('lastfmService', function($http){

    var authenticateUri = "http://www.last.fm/api/auth/";
    var apiKey = "600be92e4856b530ec9ffaef2906e5a6";

    var getSongInfoUri = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&format=json";
    var getAlbumInfoUri = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&format=json";
    var getTopTracksUri = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&format=json"
    var getSimilarTracksUri = "http://ws.audioscrobbler.com//2.0/?method=track.getsimilar&format=json";


    this.getSongInfo = function(artist, track){
        console.log("Retrieving Track Info from Last.fm: "+artist+", "+track);

        return $http({
                method: 'GET',
                url: getSongInfoUri + "&api_key=" + apiKey + "&artist=" + artist + "&track=" + track,
            }).then(function($response){
                console.log($response)
                return $response.data.track;
            });
    }

    this.getAlbumInfo = function(artist, album){
        console.log("Retrieving Album Info from Last.fm: "+artist+", "+album);

        return $http({
                method: 'GET',
                url: getAlbumInfoUri + "&api_key=" + apiKey + "&artist=" + artist + "&album=" + album,
            }).then(function($response){
                console.log($response)
                return $response.data.album;
            });
    }

    this.getTopTracks = function(callback){
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

    this.getSimilarTracks = function(title, artist, limit, callback){
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

})