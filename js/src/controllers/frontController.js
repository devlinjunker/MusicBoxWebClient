musicBox.controller(
    'frontController',
function($scope, $location, musicBoxSession, user, spotifyService, lastfmService){
    $scope.boxSession = musicBoxSession;

	$scope.user = user;

	$scope.nearbyDevices = musicBoxSession.nearbyDevices;

	$scope.hideSongSearch = true;

	$scope.$parent.changeHomeFunction(function(){
		$scope.viewDeviceList();
	})

	if(musicBoxSession.getCurrentDevice() == undefined){
		musicBoxSession.getNearbyDevices().then(function(boxes){
			musicBoxSession.nearbyDevices = boxes;

			var activeDevice = undefined;
			
			if(user.devices.length == 0){
				for(i in boxes){
					if(boxes[i].isPlaying()){
						activeDevice = boxes[i];
						break;
					}
				}
				
			}else{
				activeDevice = user.getFirstActiveBox();
			}
			
			if(activeDevice != undefined){
				musicBoxSession.subscribeDevice(activeDevice.deviceUri);
				musicBoxSession.setCurrentDevice(activeDevice);
			}
		});
	}

	if(user.permissions == undefined){
		user.tryLogin().then(function(){
			$location.path("admin")	
		}, function(){
			$scope.$parent.hideQuickControls = true;
		});
	}
	
    $scope.songToAdd = undefined;

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

	$scope.selectDevice = function(device){
		if(musicBoxSession.getCurrentDevice() != null){
			var dev = musicBoxSession.getCurrentDevice();
			musicBoxSession.unsubscribeDevice(dev.deviceUri);
		}
		
		musicBoxSession.setCurrentDevice(device);
		musicBoxSession.subscribeDevice(device.deviceUri);
	}

	$scope.viewDeviceList = function(device){
		if(musicBoxSession.getCurrentDevice() != null){
			var dev = musicBoxSession.getCurrentDevice();
			musicBoxSession.unsubscribeDevice(dev.deviceUri);
		}
		
		musicBoxSession.setCurrentDevice(undefined);
		
		musicBoxSession.getNearbyDevices().then(function(boxes){
			musicBoxSession.nearbyDevices = boxes;
		});
	}

    $scope.songSearch = function(value){
       return spotifyService.search(value);
    }
	
	$scope.songSearchClicked=function(){
		if($scope.isMobile){
			$scope.hideSongSearch = false;
		}
	}

    $scope.addTrack = function(){
        if(musicBoxSession.getCurrentDevice().Playing != 0){
            var song = $scope.songToAdd;
			console.log(song)

            // First get album info for artwork
            var album = lastfmService.getAlbumInfo(song.ArtistName, song.AlbumName);
            album.then(function(album){
				
				if(album != undefined){
					song.ArtworkURL = album.image[2]["#text"];
				}

                // Then get song Info for duration
                var songInfo = lastfmService.getSongInfo(song.ArtistName, song.Title);
                songInfo.then(function(songInfo){
                    song.Length = songInfo.duration / 1000;

					// Song will be added by the socket callback
//                    musicBoxSession.getCurrentDevice().addTrack(song);

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

    musicBoxSession.addCallback(handleMessages);
});