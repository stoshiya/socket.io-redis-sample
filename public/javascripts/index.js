(function($) {
  var socket = io();

  var start = new Date();

  socket.on('connect', function() {
    var index = socket.io.engine.upgrade ? 1 : 0;
    $('p').text('Connection established in ' + (new Date() - start) + 'msec. ' +
      'You are using ' + socket.io.engine.transports[index] + '.');
    $('input').removeAttr('disabled');
    $('button').removeAttr('disabled');
  });

  socket.on('message', function(data) {
    $('div.message > ul').append('<li>' + new Date().toString() + ': ' + data + '</li>');
  });

  $('input').keydown(function(e) {
    if (e.keyCode === 13) { // press ENTER.
      submitHandler();
    }
  });

  $('button').click(function() {
    submitHandler();
  });

  function submitHandler() {
    var text = $('input').val();
    if (text.length > 0) {
      socket.emit('message', text);
      $('input').val('');
      $('div.message > ul').append('<li>' + new Date().toString() + ': ' + text + '</li>');
    }
  }
}(jQuery));
