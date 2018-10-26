import * as ApiUtil from './ApiUtil/ApiUtil'
import bodyParser from 'body-parser'
import socket from 'socket.io'
import express from 'express'
import mongoose from 'mongoose'
import WebHook from './Router/WebHook'
import Records from "./Router/Records";
// App setup
let app = express();
let server = app.listen(4000, () => console.log('listening for requests on port 4000,'))

mongoose.connect('mongodb://admin:asdasd@l\
eaderboard-shard-00-00-nvj4r.mongodb.net:27017,leaderboard\
-shard-00-01-nvj4r.mongodb.net:27017,leaderboard-shard-00-02-nv\
j4r.mongodb.net:27017/retail?authSource=admin&replicaSet=leaderboard\
-shard-0&ssl=true', {useNewUrlParser: true}).then(
    res => console.log('connected to db')
).catch(
    err => console.log(err)
);


let db = mongoose.connection;

// Check for DB errors
db.on('error', (err) => console.log(err))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/webHook', WebHook)
app.use('/records', Records)

// Static files
app.get('/', (req, res) => {
        console.log('hh')
        res.send('published on')
    }
)
app.get('/feed/:id', (req, res) => {
        console.log(req.params)
        res.send('published on')
    }
)

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle publish event from ocs 
    socket.on('publish_feed', function (data) {

        io.sockets.emit('sending_feed_to_another_site', data);

    });

    app.post('/', (req, res) => {

        io.sockets.emit('sending_feed_to_another_site', ApiUtil.reformatArticle(req.body));

        res.send('published on another site')
    })

});
