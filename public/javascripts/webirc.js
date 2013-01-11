;(function ($, window, undefined) {
  'use strict';

  var channels = {};
  var privates = [];
  var nickname = null;

  $(document).ready(function() {
    $('#login').reveal();

    $('#authenticate').change(function() {
      if($(this).is(':checked')) {
        $('#services').show();
      } else {
        $('#services').hide();
      }
    });

    $('#connect').click(function(e) {
      e.preventDefault();

      $('#login').trigger('reveal:close');

      nickname = $('#nickname').val();

      var socket = io.connect();

      socket.emit('connect', nickname, '', '');

      socket.on('join', function(channel, nick, message) {
        console.log(nick);
        if(nick === nickname) {
          channels[channel] = {};
        }
      });

      socket.on('topic', function(channel, topic, nick, message) {
        //console.log(channel, topic, nick, message);
        if(channels[channel]) {
          channels[channel].topic = topic;
        }
      });

      socket.on('names', function(channel, nicks) {
        if(channels[channel]) {
          channels[channel].nicks = nicks;
        }
      });

      socket.on('message', function(from, to, text, message) {
        console.log(message, to, text, message);
        if(channels[to]) {
          console.log(message);
        }
      });

      socket.on('info', function(info) {
        $('#status').append('<pre>' + info + '</pre>');
        $("#status").get(0).scrollTop = 10000000;
      });

      $('#message-text').keydown(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
          var message = $(this).val();
          socket.emit('say', '#coljstest', message);
          $(this).val('');
        }
      });
    });

    $('.tab').click(function(e) {
      e.preventDefault();
    });

  });

})(jQuery, this);