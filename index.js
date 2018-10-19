
var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser')
// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

const reformatArticle= article=>{
    let key = Object.keys(article)
    let value = Object.values(article)
    let newJson = {}
key.map((n,i)=>{
    switch (n){
        case 'article_name':
        key[i] = 'handle'
        break
        case 'article_body':
        key[i] = 'message'
        break

    }
newJson[key[i]]= value[i]
})
return newJson



}
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

        io.sockets.emit('sending_feed_to_another_site', reformatArticle(req.body));
    
        res.send('published on another site')
    })

});
