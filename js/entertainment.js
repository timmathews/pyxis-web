$(document).ready(function() {
  var conn = new WebSocket("ws://pyxis.openseasproject.org/ws/v1/data");
  conn.onmessage = function(evt) {
    var d;
    try {
      d = $.parseJSON(evt.data);
    } catch(err) {
      console.log('Malformed JSON: ' + evt.data);
    }
    if(d) {
      updatePage(d);
    }
  }
});

function updatePage(data) {
  if(data.entertainment) {
    var title = data.entertainment.trackTitle;
    var album = data.entertainment.album;
    var artist = data.entertainment.artist;
    var elapsed = data.entertainment.timeElapsed;
    var length = data.entertainment.trackLength;
    var progress = length / elapsed * 100;
    elapsed = elapsed/60 + ':' + elapsed % 60;
    length = length/60 + ':' + length % 60;

    $('#title').text(title);
    $('#album').text(album);
    $('#artist').text(artist);
    $('#progressbar .sr-only').text(Math.round(progress));
    $('#progressbar').css('width', progress + '%');
    $('#progress').text(elapsed + ' of ' + length);
  }
}

