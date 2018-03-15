var player;
var lastButton = '';
const youtube = 'youTubeIframe';
const titleInsert = '.js-title-insert';
const btnPlay = '.js-play';
const btnPause = '.js-pause';
const modalId = '#modalVideo';
const videoQuality = 'hd720';

function onYouTubePlayerAPIReady() {
  player = new YT.Player(youtube, {
    controls: 2,
    iv_load_policy: 3,
    rel: 0,
    events: {
      onReady: onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  'use strict';
  $(btnPlay).on('click', function() {
    var videoId = $(this).attr('data-src');
    
    if (lastButton == videoId) {
      $(titleInsert).text($(this).attr('data-title'));
      player.playVideo(videoId, 0, videoQuality);
    } else {
      $(titleInsert).text($(this).attr('data-title'));
      player.loadVideoById(videoId, 0, videoQuality);
      lastButton = videoId;
    }
  });
  
  $(btnPause).on('click', function() {
    player.pauseVideo();
  });
  
  $(modalId).on('click', function() {
    player.pauseVideo();
  });
}