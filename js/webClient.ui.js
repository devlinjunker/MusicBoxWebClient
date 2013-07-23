var client = (function(webClient){
    if(webClient == null) webClient = {};

    webClient.ui = {};

    var songQueue = {};

    // webClient.subscribeChannel(channelUri, function(topicUri, ){

    // });

    $(window).load(function(){
        initializeInteractions(webClient.ui);

        webClient.lastfm.getTopTracks(buildTopTracksTab);
    });

    function buildTopTracksTab(data){
        console.log("Top Track Data: ");
        console.log(data);
    }


    function initializeInteractions(ui){
        initializeControls(ui);
        initializeTabs(ui);
        initializeDeviceControllerTab(ui);
    }


    function initializeControls(ui){
        ui.deviceControls = $("#device_controls");
        ui.deviceControls.songControls = ui.deviceControls.find("#song_controls");

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
                ui.deviceControls.songControls.buttons.playPause.attr('data-state', "play")
            }
        });

        ui.deviceControls.songControls.buttons.skip.click(function(){
            webClient.sendSkipMessage();
            ui.deviceController.queue.removeSong(0);
        });

    }

    /// <summary>
    function initializeTabs(ui){
        ui.tabs = $("#tab_area");
        ui.tabs.tabController = ui.tabs.find("#tab_controller");
        ui.tabs.tabController.selectors = ui.tabs.tabController.find(".tab_selector");
        ui.tabs.deviceTabSelector = ui.tabs.tabController.selectors.filter("#tab1");
        ui.tabs.findSongsTabSelector = ui.tabs.tabController.selectors.filter("#tab2");

        ui.tabs.tabViews = ui.tabs.find(".tab_view");
        ui.tabs.deviceTabView = ui.tabs.tabViews.filter("#device_controller");
        ui.tabs.findSongView = ui.tabs.tabViews.filter("#find_songs")


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
            ui.tabs.tabViews.not("#"+ui.tabs.findSongView.attr('id')).hide();
            ui.tabs.findSongView.show();
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

        // TODO: set up autocomplete recent songs from cache (local, [server eventually])

        // Set up autocomplete for the queue search field
        ui.deviceController.queueControls.searchField.autocomplete({
            minLength: 3,
            source: webClient.spotify.search,
            select: function(event, selected){
                // Get details from spotify
                var title = selected.item.label;
                var uri = selected.item.value;
                var album = selected.item.album;
                var artist = selected.item.artist;

                // get album art from last.fm
                webClient.lastfm.getAlbumInfo(artist, album, function(albumInfo){
                    console.log(albumInfo);

                    var imgUri = albumInfo.image[0]["#text"];

                    ui.deviceController.queue.addSong("Spotify", uri, null, title, album, artist, uri, imgUri);
                });

                // clear search field
                ui.deviceController.queueControls.searchField.val("");
                return false;
            }
        });

        $.extend(ui.deviceController.queue, {
            // Array to hold song objects
            songQueue: [],
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
            addSong:function(service, serviceId, trackId, title, album, artist,
                    detail, imgUri){

                webClient.sendAddTrackMessage(service, serviceId);

                var song = webClient.template.queue.track(trackId, title, artist,
                    detail, imgUri);

                if(this.songQueue.length == 0){
                    this.noSongAlert.hide();
                }

                var index = this.songQueue.push(song)-1;

                song.removeButton.bind('click', function(){
                    ui.deviceController.queue.removeSong(index)
                });

                $(ui.deviceController.queue).append(song)
                ui.deviceController.queue.append(song);
            },
            // Removes the song at the index from the song queue array and webpage
            removeSong:function(index){
                // TODO: send remove song message to socket
                console.log("Removed Song from Queue at index "+index+": ");
                var removed = this.songQueue.splice(index, 1)[0];
                console.log(removed);

                this.getSongs().eq(index).remove();

                if(this.songQueue.length == 0){
                    this.noSongAlert.show();
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

    /***** EVENT HANDLERS *****/

    /// <summary>Handles the QueueRefresh Event, checks that there is a queue
    /// object in the Event and updates the webClient queue to match</summary>
    /// <param name="topicUri">The Uri that the event came from</param>
    /// <param name="Event">An object representing the details of the event
    /// message</param>
    function queueRefreshEventHandler(topicUri, Event){
            if(Event.queue != null){
                // TODO: Check that this removes all songs
                ui.deviceController.queue.songs().remove();
                for(song in Event.queue){
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