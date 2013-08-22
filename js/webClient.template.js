var client = (function(webClient){
    if(webClient == null) webClient = {};

    webClient.template = {};
    webClient.template.queue = {};
    webClient.template.find = {};

    webClient.template.track = function(trackId, trackTitle, trackArtist, trackDetail, trackImgUri){
        var element = $("<div></div>").addClass("song_info");

        element.track = {};

        element.track.Id = trackId;
        element.track.title = trackTitle;
        element.track.artist = trackArtist;
        element.track.detail = trackDetail;
        element.track.imageUri = trackImgUri;

        return element;
    }

    webClient.template.queue.track = function(trackId, trackTitle, trackArtist, trackDetail, trackImgUri){
        console.log("Creating Track Container from Template");


        var element = webClient.template.track(trackId, trackTitle, trackArtist, trackDetail, trackImgUri);

        element.attr("data-song-id", trackId);

        element.removeButton = $("<div></div>")
                                    .addClass("icon-small icon-remove");
        element.append(element.removeButton);

        element.albumArt = $("<img/>")
                                .addClass("song_img")
                                .attr('src', trackImgUri);
        element.append(element.albumArt);

        element.songTitle = $("<header></header>")
                                .addClass("song_title")
                                .text(trackTitle);
        element.append(element.songTitle);

        element.songDetails = $("<p></p>")
                                .addClass("song_details")
                                .text(trackDetail)
        element.append(element.songDetails);

        element.purchaseContainer = $("<div></div>")
                                        .addClass("purchase_container");
        element.append(element.purchaseContainer);

        return element;
    }

    webClient.template.find.track = function(trackId, trackTitle, trackArtist, trackDetail, trackImgUri){
        console.log("Creating Track Container From Template");

        console.log(arguments);

        var element = webClient.template.track(trackId, trackTitle, trackArtist, trackDetail, trackImgUri);

        element.songTitle = $("<header></header>")
                                .addClass("song_title")
                                .text(trackTitle);
        element.append(element.songTitle);

        // element.addButton = $("<span></span>")
        //                         .addClass("icon-stack add_song_button")
        //                         .append(
        //                             $("<i></i>")
        //                                 .addClass("icon-circle")
        //                         )
        //                         .append(
        //                             $("<i></i>")
        //                                 .addClass("icon-small icon-plus-sign")
        //                         );
        element.addButton = $("<i></i>")
                                .addClass("icon-plus-sign add_song_button icon-large");
        element.append(element.addButton);

        return element;
    }

    return webClient;
})(client);