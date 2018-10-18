// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output')

// Emit events
btn.addEventListener('click', function(){
  socket.emit('publish_feed', {
      message: message.value,
      handle: handle.value
  });
  message.value = "";
});

// Listen for events
socket.on('sending_feed_to_another_site', function(data){
    console.log(data)
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});
