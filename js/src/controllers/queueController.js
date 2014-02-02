musicBox.controller(
    'queueController',
function($scope, musicBoxSession, user, spotifyService, lastfmService){
    $scope.boxSession = musicBoxSession;


    $scope.addSongHidden = true;

    $scope.songToAdd = undefined;

    $scope.timeout = undefined;

    var textWidth = function(text, font) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    $(".song_search").hover(function(){
        $(this).find('ul').hover(function(){
            $(this).find('li').each(function(){
                var el = $(this);

                var font = el.css('font-size')+" ";
                font += el.css('font-family');

                var containerWidth = $('.song_search').width();
                var width = textWidth(el.text(), font);

                var shiftedWidth = (width - containerWidth > 0) ? width - containerWidth : 0;

                var shiftedWidthpx =   "-" + shiftedWidth + "px";

                $(this).hover(function(){
                    el.animate({"margin-left": shiftedWidthpx}, shiftedWidth*25);
                }, function(){
                    el.stop(true).css("margin-left", "0px");
                });
            });
        });
    });

    $scope.showAddSong = function(){
        $scope.addSongHidden = false;

        setTimeout(function(){
            $('.song_search').children('input').first().focus();
        }, 200)
    }

    $scope.delayHideSongSearch = function(){
        $scope.timeout = setTimeout(function(){
            $scope.$apply(function(){
                $scope.addSongHidden = true;
            });
        }, 500);
    }

    $scope.clearHideSongSearch = function(){
        clearTimeout($scope.timeout);
    }

    $scope.songSearch = function(value){
       return spotifyService.search(value);
    }

    $scope.addTrack = function(){
        if(musicBoxSession.getCurrentDevice().Playing != 0){
            var song = $scope.songToAdd;

            // First get album info for artwork
            var album = lastfmService.getAlbumInfo(song.ArtistName, song.AlbumName);
            album.then(function(album){

                song.ArtworkURL = album.image[2]["#text"];

                // Then get song Info for duration
                var songInfo = lastfmService.getSongInfo(song.ArtistName, song.Title);
                songInfo.then(function(songInfo){
                    song.Length = songInfo.duration / 1000;


                    musicBoxSession.getCurrentDevice().addTrack(song);

                    musicBoxSession.sendAddTrackMessage(song);
                })
            });
        }

        $scope.songToAdd = undefined;
        $scope.addSongHidden = true;
    }

    function handleMessages(topicUri,event){
        $scope.$apply(function(){});
    }

    musicBoxSession.addCurrentDeviceCallback(handleMessages);
});