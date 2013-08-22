var client = (function(webClient){
    if(webClient == null) webClient = {};

    webClient.ui = {};

    // TODO: Move this
    webClient.user = {};

    $.extend(webClient.user,
    {
        similarSongs: [],
        similarSongTally: {},
        addSimilarSong: function(song){
            this.similarSongs.push(song);
            webClient.ui.tabs.findSongTabView.similarSongArea.prepend(song);

            if(this.similarSongTally[song.track.title] != undefined)
            {
                this.similarSongTally[song.track.title]++;
            }
            else
            {
                this.similarSongTally[song.track.title] = 1;
            }
        },
        normalizeSimilarSongs: function(){

        }
    });

    // webclient.user.addSimilarSongs: (function(this, songs){
    //     console.log(songs);
    //     if(songs.length != undefined)
    //     {
    //         for(song in songs){
    //             webclient.user.similarSongs.push(song);
    //             webClient.ui.tabs.findSongTabView.similarSongArea.prepend(song);
    //         }
    //     }
    //     else
    //     {
    //         webclient.user.similarSongs.push(song);
    //         webClient.ui.tabs.findSongTabView.similarSongArea.prepend(song);
    //     }
    // }

    var songQueue = {};

    // webClient.subscribeChannel(channelUri, function(topicUri, ){

    // });

    $(window).load(function(){
        initializeInteractions(webClient.ui);
    });


    function initializeInteractions(ui){
        initializeSongController(ui);
        initializeTabController(ui);
        initializeDeviceControllerTab(ui);
        initializeFindTracksTab(ui);
    }


    function initializeSongController(ui){
        ui.deviceControls = $("#device_controls");
        ui.deviceControls.songControls = ui.deviceControls.find("#song_controls");
        ui.deviceControls.devicePicker = ui.deviceControls.find("#device_picker");

        webClient.getDeviceList(function(results)
        {
            console.log(this.results);
        });

        $.extend(ui.deviceControls.songControls, {
            currentSongInfo: $("#current_song_detail"),
            buttons: ui.deviceControls.songControls.find(".btn")
        });

        $.extend(ui.deviceControls.songControls.buttons, {
            playPause: ui.deviceControls.songControls.buttons.filter("#song_play_pause"),
            skip: ui.deviceControls.songControls.buttons.filter("#song_skip")
        });

        ui.deviceControls.songControls.buttons.playPause.click(function(){
            if(ui.deviceControls.songControls.buttons.playPause.attr('data-state') == "play"){
                webClient.sendPauseMessage();
                ui.deviceControls.songControls.buttons.playPause.removeClass('icon-pause');
                ui.deviceControls.songControls.buttons.playPause.addClass('icon-play');
                ui.deviceControls.songControls.buttons.playPause.attr('data-state', "pause")
            }
            else
            {
                webClient.sendPlayMessage();
                ui.deviceControls.songControls.buttons.playPause.removeClass('icon-play');
                ui.deviceControls.songControls.buttons.playPause.addClass('icon-pause');
                ui.deviceControls.songControls.buttons.playPause.attr('data-state', "play");
            }
        });

        ui.deviceControls.songControls.buttons.skip.click(function(){
            webClient.sendSkipMessage();
            ui.deviceController.queue.endSong();
        });

    }

    /// <summary>
    function initializeTabController(ui){
        ui.tabs = $("#tab_area");
        ui.tabs.tabController = ui.tabs.find("#tab_controller");
        ui.tabs.tabController.selectors = ui.tabs.tabController.find(".tab_selector");
        ui.tabs.deviceTabSelector = ui.tabs.tabController.selectors.filter("#tab1");
        ui.tabs.findSongsTabSelector = ui.tabs.tabController.selectors.filter("#tab2");

        ui.tabs.tabViews = ui.tabs.find(".tab_view");
        ui.tabs.deviceTabView = ui.tabs.tabViews.filter("#device_controller");
        ui.tabs.findSongTabView = ui.tabs.tabViews.filter("#find_song_controller")


        ui.tabs.deviceTabSelector.click(function(){
            console.log(this);
            console.log(ui.tabs.deviceTabSelector);
            ui.tabs.tabController.selectors.removeClass("selected");
            ui.tabs.deviceTabSelector.addClass("selected");
            ui.tabs.tabViews.not("#"+ui.tabs.deviceTabView.attr('id')).hide();
            ui.tabs.deviceTabView.show();
        });

        ui.tabs.findSongsTabSelector.click(function(){
            ui.tabs.tabController.selectors.removeClass("selected");
            ui.tabs.findSongsTabSelector.addClass("selected");
            ui.tabs.tabViews.not("#"+ui.tabs.findSongTabView.attr('id')).hide();
            ui.tabs.findSongTabView.show();
        });
    }

    /// <summary>Initializes the device controller tab (for now only initializes
    /// queue functionality)</summary>
    function initializeDeviceControllerTab(ui){
        ui.deviceController = $("#device_controller");
        initializeDeviceQueue(ui);
    }

    /// <summary>Enables the event handler for queue refresh messages and
    /// initializes the UI actions for the device song queue on the queue
    /// controller tab (add, remove, getSongs)</summary>
    /// <param name="ui">UI object that will store all interface actions</param>
    function initializeDeviceQueue(ui){
        // Enables the event handler for queue refresh socket messages
        enableQueueRefreshEvent();

        ui.deviceController.queueControls = $("#queue_controls");
        ui.deviceController.queueControls.refreshButton = $("#refresh_queue");
        ui.deviceController.queueControls.searchField = $("#song_search_field");
        ui.deviceController.queue = $("#queue_list");

        webClient.sendRefreshMessage();

        // TODO: set up autocomplete recent songs from cache (local, [server eventually])

        // Set up autocomplete for the queue search field
        ui.deviceController.queueControls.searchField.autocomplete({
            minLength: 3,
            source: function(request, callback){
                console.log("Searching Spotify: "+request.term);
                console.log("Full Request:");
                console.log(request);

                webClient.spotify.search(request.term, callback);
            },
            response: function(event, ui){
                console.log(ui);
            },
            select: function(event, selected){
                // Get details from spotify
                var title = selected.item.label;
                var uri = selected.item.value;
                var album = selected.item.album;
                var artist = selected.item.artist;

                ui.deviceController.queue.addSong("Spotify", uri, null, title, album, artist, "", null);

                // clear search field
                ui.deviceController.queueControls.searchField.val("");
                return false;
            }
        });

        $.extend(ui.deviceController.queue, {
            // Array to hold song objects
            songQueue: [],
            songHistory: [],
            noSongAlert: $("#no_song_alert"),
            // TODO: Header
            getSongs: function(){
                return ui.deviceController.queue.find(".song_info");
            },
            // TODO: Header
            getSongAt: function(index){
                return ui.deviceController
            },
            // Add song with the details specified to the song queue, sends an
            // add message to the socket, creates a new song and adds it to the
            // song queue array and webpage
            addSong: function(service, serviceId, trackId, title, album, artist, detail, imgUri){
                console.log("adding song")
                if(serviceId == null){
                    console.log("No Service Id")
                    this.getServiceId(service, title, album, artist, function(id){
                        serviceId = id;

                        if(imgUri == null){
                            console.log("No Img URI")
                            ui.deviceController.queue.getImgUri(artist, album, function(uri){
                                imgUri = uri;
                                ui.deviceController.queue._addSong("Spotify", serviceId, trackId, title, album, artist, detail, imgUri);
                            });
                        }else
                        {
                           ui.deviceController.queue._addSong("Spotify", serviceId, trackId, title, album, artist, detail, imgUri);
                        }
                    });

                }
                else if(imgUri == null){
                    console.log("No Img URI")
                    ui.deviceController.queue.getImgUri(artist, album, function(uri){
                        imgUri = uri;
                        ui.deviceController.queue._addSong("Spotify", serviceId, trackId, title, album, artist, detail, imgUri);
                    });
                }
                else{
                    ui.deviceController.queue._addSong("Spotify", serviceId, trackId, title, album, artist, detail, imgUri);
                }

                if(this.songQueue.length == 0){
                    ui.deviceControls.songControls.currentSongInfo.text(title);

                    if(ui.deviceControls.songControls.buttons.playPause.attr("data-state") == "pause"){
                        ui.deviceControls.songControls.buttons.playPause.removeClass('icon-play');
                        ui.deviceControls.songControls.buttons.playPause.addClass('icon-pause');
                        ui.deviceControls.songControls.buttons.playPause.attr('data-state', "play");
                    }
                }
            },
            getServiceId: function(service, title, album, artist, callback){
                console.log('getting service id (artist: '+artist+', title: '+title+'album: '+album);
                if(service == "Spotify"){
                    webClient.spotify.getServiceId(title, artist, album, function(id){
                        var id = id;
                        callback(id);
                    });
                }
            },
            getImgUri: function(artist, album, callback){
                console.log(artist);
                console.log(album);

                // get album art from last.fm
                webClient.lastfm.getAlbumInfo(artist, album, function(albumInfo){
                    console.log(albumInfo);

                    if(albumInfo == undefined)
                    {
                        callback(null);
                    }
                    callback(albumInfo.image[0]["#text"]);

                });
            },
            _addSong: function(service, serviceId, trackId, title, album, artist, detail, imgUri){
                webClient.sendAddTrackMessage(service, serviceId);

                var song = webClient.template.queue.track(trackId, title, artist,
                    detail, imgUri);

                if(this.songQueue.length == 0){
                    this.noSongAlert.hide();
                }

                var index = this.songQueue.push(song)-1;

                song.removeButton.bind('click', function(){
                    console.log('remove button pressed')
                    ui.deviceController.queue.removeSong(song)
                });

                $(ui.deviceController.queue).append(song)
                //ui.deviceController.queue.append(song);

                // TODO: Probably should be event
                rebuildSimilarTracks(ui);
            },
            endSong: function(){
                if(this.songQueue.length != 0)
                {
                    ui.deviceController.queue.children(".song_info").first().remove();
                    var song = this.songQueue.splice(0, 1);

                    this.songHistory.push(song);

                    if(this.songQueue.length != 0){
                        ui.deviceControls.songControls.currentSongInfo.text(this.songQueue[0].track.title);
                    }
                }
            },
            // Removes the song at the index from the song queue array and webpage
            removeSong:function(song){
                // TODO: send remove song message to socket

                var removed;

                for(index in this.songQueue){
                    if(this.songQueue[index] == song){
                        removed = this.songQueue.splice(index, 1)[0];

                        ui.deviceController.queue.children(".song_info").get(index).remove();
                    }
                }

                // removed.remove();

                // this.getSongs().eq(index).remove();

                if(this.songQueue.length == 0){
                    ui.deviceControls.songControls.currentSongInfo.text("No Song Playing Currently");
                }
            }
        });
    }

    /// <summary>Subscribes queueRefreshEventHandler() to the QueueRefesh
    /// Event</summary>
    function enableQueueRefreshEvent(){
        // TODO: Move this elsewhere
        var queueChannelUri = "http://www.musicbox.com/"+userName+"/"+deviceName;
        webClient.subscribeChannel(channelUri, queueRefreshEventHandler);
    }

    function initializeFindTracksTab(ui){
        ui.tabs.findSongTabView.findSongArea = $("#find_song_area");
        ui.tabs.findSongTabView.similarSongArea = $("#similar_song_area");


        function buildTopTracks (data){
            console.log("Top Track Data: ");
            console.log(data);

            var i = 0;
            for(id in data.tracks.track)
            {
                if(i < 10)
                {
                    var track = data.tracks.track[id];

                    var trackImg = (track.image != undefined ? track.image[0]["#text"] : '')
                    var song = webClient.template.find.track('',track.name, track.artist.name, track.url, trackImg);

                    song.addButton.click(function(){
                        ui.deviceController.queue.addSong("Spotify", null, null,
                            song.track.title, null, song.track.artist, null, null);
                    });


                    ui.tabs.findSongTabView.similarSongArea.append(song);

                    i++;
                }
            }
        };

        webClient.lastfm.getTopTracks(buildTopTracks);
    }

    function buildSimilarTracks(data){
        console.log("Similar Track Data");
        console.log(data);

        var songs = data.similartracks.track;

        for(i in songs){
            var track = songs[i];

            var song = new webClient.template.find.track('',
                                                        track.name,
                                                        track.artist.name,
                                                        '',
                                                        '');

            song.addButton.click(function(){
                console.log('test');
                webClient.ui.deviceController.queue.addSong("Spotify", null, null,
                    song.track.title, null, song.track.artist, null, null);
            });

            webClient.user.addSimilarSong(song);
            webClient.user.normalizeSimilarSongs();
        }

        console.log(webClient.user);
    }

    function rebuildSimilarTracks(ui){
        var songs = ui.deviceController.queue.songQueue.concat(ui.deviceController.queue.songHistory);

        for(i in songs){
            console.log(songs[i]);
            webClient.lastfm.getSimilarTracks(songs[i].track.title, songs[i].track.artist, 20, buildSimilarTracks);
        }
    }

    /***** EVENT HANDLERS *****/

    /// <summary>Handles the QueueRefresh Event, checks that there is a queue
    /// object in the Event and updates the webClient queue to match</summary>
    /// <param name="topicUri">The Uri that the event came from</param>
    /// <param name="Event">An object representing the details of the event
    /// message</param>
    function queueRefreshEventHandler(topicUri, Event){
            if(Event.data.queue != null){

                if(Event.data.isPlaying == 1){
                    ui.deviceControls.songControls.buttons.playPause.removeClass('icon-pause');
                    ui.deviceControls.songControls.buttons.playPause.addClass('icon-play');
                    ui.deviceControls.songControls.buttons.playPause.attr('data-state', "pause")
                }
                else
                {
                    ui.deviceControls.songControls.buttons.playPause.removeClass('icon-play');
                    ui.deviceControls.songControls.buttons.playPause.addClass('icon-pause');
                    ui.deviceControls.songControls.buttons.playPause.attr('data-state', "play")
                }

                // TODO: Check that this removes all songs
                ui.deviceController.queue.songs().remove();
                for(i in Event.data.queue){
                    var song = Event.queue[i];
                    webClient.spotify.lookup(song.URL, function(data){
                        var service = song.Service;
                        var serviceId = song.URL;
                        var trackId = 1;
                        var title = data.name;
                        var artist = data.artist.name;
                        var detail = serviceId;
                        var imgUri = "";
                        ui.deviceController.queue.addSong(service, serviceId,
                            trackId, title, artist, detail, imgUri);
                    });
                }
            }
    }

    return webClient;
})(client);