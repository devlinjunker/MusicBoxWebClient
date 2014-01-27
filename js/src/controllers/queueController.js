musicBox.controller(
    'queueController',
function($scope, trackQueue, musicBoxSession, user, spotifyService){
    $scope.queue = trackQueue.queue;
    $scope.history = trackQueue.history;

    $scope.addSongHidden = true;

    $scope.songToAdd = undefined;

    $scope.timout = undefined;

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

                var shiftedWidth =   "-" + shiftedWidth + "px";

                $(this).hover(function(){
                    el.animate({"margin-left": shiftedWidth}, 3500);
                }, function(){
                    el.stop(true).css("margin-left", "0px");
                });
            });
        });

    });

    // Returns true if the trackQueue Service queue is empty, false otherwise
    $scope.isEmpty = function(){
        return trackQueue.emptyQueue();
    }

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
        trackQueue.addTrack($scope.songToAdd);
        console.log($scope.songToAdd)

        $scope.songToAdd = undefined;
        $scope.addSongHidden = true;
    }
});