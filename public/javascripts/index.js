(function($) {
  var socket = io.connect();
  socket.socket.options['connect timeout'] = 2000;

  var start = new Date();

  socket.on('connect', function() {
    $('p').text('Connection established in ' + (new Date() - start) + 'msec. You are using ' + socket.socket.transport.name + '.');
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
