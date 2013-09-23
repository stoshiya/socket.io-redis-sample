(function($) {
  var socket = io.connect();

  socket.on('message', function(data) {
    $('div.message > ul').append('<li>' + new Date().toString() + ': ' + data + '</li>');
  });

  $('button').click(function() {
    var text = $('input').val();
    if (text.length > 0) {
      socket.emit('message', text);
      $('input').val('');
      $('div.message > ul').append('<li>' + new Date().toString() + ': ' + text + '</li>');
    }
  });
}(jQuery));
