var client = (function(webClient){
    if(webClient == null) webClient = {};

    webClient.ui = {};

    var songQueue = {};

    // webClient.subscribeChannel(channelUri, function(topicUri, ){

    // });

    $(window).load(function(){
        initializeInteractions(webClient.ui);
    });

    function initializeInteractions(ui){
        ui.tabs = $("#tab_area");
        ui.tabs.tabController = ui.tabs.find("#tab_controller");
        ui.tabs.tabController.selectors = ui.tabs.tabController.find(".tab_selector");
        ui.tabs.deviceTabSelector = ui.tabs.tabController.selectors.filter("#tab1");
        ui.tabs.findSongsTabSelector = ui.tabs.tabController.selectors.filter("#tab2");

        console.log(ui.tabs.findSongsTabSelector);

        ui.tabs.tabViews = ui.tabs.find(".tab_view");
        ui.tabs.deviceTabView = ui.tabs.tabViews.filter("#device_controller");
        ui.tabs.findSongView = ui.tabs.tabViews.filter("#find_songs")

        ui.tabs.deviceTabSelector.click(function(){
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

        ui.deviceControls = $("#device_controls");
        ui.deviceControls.songControls = ui.deviceControls.find("#song_controls");
        ui.deviceControls.songControls.buttons = ui.deviceControls.songControls.find(".btn");
        ui.deviceControls.songControls.buttons.playPause = ui.deviceControls.songControls.buttons.filter("#song_play_pause");
        ui.deviceControls.songControls.buttons.skip = ui.deviceControls.songControls.buttons.filter("#song_skip");

        ui.deviceControls.songControls.buttons.playPause.click(function(){
            if(ui.deviceControls.songControls.buttons.playPause.attr('data-state') == "play"){
                webClient.sendPauseMessage();
                ui.deviceControls.songControls.buttons.playPause.attr('data-state', "pause")
            }
            else
            {
                webClient.sendPlayMessage();
                ui.deviceControls.songControls.buttons.playPause.attr('data-state', "play")
            }
        });

        ui.deviceControls.songControls.buttons.skip.click(function(){
            webClient.sendSkipMessage();
            ui.deviceController.queue.removeSong(0);
        })

        ui.deviceController = $("#device_controller");
        ui.deviceController.queueControls = ui.deviceController.find("#queue_controls");
        ui.deviceController.queueControls.addButton = ui.deviceController.find("#add_song");
        ui.deviceController.queueControls.searchField = ui.deviceController.find("#song_search_field");
        ui.deviceController.queue = ui.deviceController.find("#queue_list");

        ui.deviceController.queueControls.searchField.autocomplete({
        //$("#song_search").autocomplete({
            minLength: 3,
            source: webClient.spotify.search,
            select: function(event, selected){
                var title = selected.item.label;
                var Uri = selected.item.value;
                ui.deviceController.queue.addSong("Spotify", Uri, null, title, null, Uri, null);
                ui.deviceController.queueControls.searchField.val("");
                return false;
            }
        });

        $.extend(ui.deviceController.queue, {
            songQueue: [],
            songs: function(){
                return ui.deviceController.queue.find(".song_info");
            },
            addSong:function(service, serviceId, trackId, title, artist, detail, imgUri){
                var command = "AddTrack,"+service+","+serviceId;

                webClient.sendMessage("AddTrack", command);

                var song = template.queue.track(trackId, title, artist, detail, imgUri);

                ui.deviceController.queue.songQueue.push(song);

                $(ui.deviceController.queue).append(song)
                ui.deviceController.queue.append(song);
            },
            removeSong:function(index){
                var removed = ui.deviceController.queue.songQueue.slice(index, 1);

                ui.deviceController.queue.songs().eq(index).remove();
            }
        });

        webClient.subscribeChannel(channelUri, function(topicUri, Event){
            if(Event.queue != null){
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
        });
    }

    return webClient;
})(client);