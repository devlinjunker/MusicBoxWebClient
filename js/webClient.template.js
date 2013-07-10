var client = (function(webClient){
    if(webClient == null) webClient = {};

    webClient.template = {};
    webClient.template.queue = {};

    webClient.template.queue.track = function(trackId, trackTitle, trackArtist, trackDetail, trackImgUri){

        var element = $("<div></div>").addClass("song_info");

        element.track = {};

        element.track.Id = trackId;
        element.track.title = trackTitle;
        element.track.detail = trackDetail;
        element.track.imageUri = trackImgUri;

        element.attr("data-song-id", trackId);

        var song_image = $("<img/>")
                                .addClass("song_img")
                                .attr('src', trackImgUri);
        element.append(song_image);
        var song_title = $("<header></header>")
                                .addClass("song_title")
                                .text(trackTitle);
        element.append(song_title);
        var song_detail = $("<p></p>")
                                .addClass("song_details")
                                .text(trackDetail);
        element.append(song_detail);

        return element;
    }

    return webClient;
})(client);