import * as ApiUtil from './ApiUtil/ApiUtil'
var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser')
// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

app.use(bodyParser.json())
// Static files
app.use(express.static('public'));


// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle publish event from ocs 
    socket.on('publish_feed', function(data){
    
        io.sockets.emit('sending_feed_to_another_site', data);
   
    });

    app.post('/',(req,res)=>{

        io.sockets.emit('sending_feed_to_another_site', ApiUtil.reformatArticle(req.body));
    
        res.send('published on another site')
    })

});
