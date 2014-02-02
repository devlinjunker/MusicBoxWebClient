musicBox.service('spotifyService', function($http){

    var searchUri = "http://ws.spotify.com/search/1/track";
    var trackLookupUri = "http://ws.spotify.com/lookup/1/";

    this.search = function(query){
        var encodedQuery = encodeURIComponent(query);

        var pages = 1;

        return $http({
                method: 'GET',
                url: searchUri+"?q="+encodedQuery+"&page="+pages
            }).then(function($response){
                var data = $response.data
                var results = new Array();

                if(data.tracks !== undefined)
                {
                    for(var i = 0; i < 10; i++)
                    {
                        if(i < data.tracks.length){
                            var track = data.tracks[i];
                            console.log(track);
                            results.push(
                                {
                                    ProviderID: track["href"],
                                    Title: track["name"],
                                    ArtistName: track.artists[0].name,
                                    AlbumName: track.album.name
                                }
                            );
                        }
                    }
                }

                console.log("Spotify Search Results ("+query+"):");
                console.log(results);

                return results;
            });
    }
})