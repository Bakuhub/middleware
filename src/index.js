import bodyParser from 'body-parser'
import socket from 'socket.io'
import express from 'express'
import mongoose from 'mongoose'
import WebHook from './Router/WebHook'
import Records from "./Router/Records"
import cors from 'cors'
import {JOIN_ROOM_BY_URL, PASS_UPDATED_RECORDS_TO_CLIENT_SIDE} from './Constants/actionType'
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
app.use(cors())
// Socket setup & pass server
let io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle publish event from ocs

    socket.on('publish_feed', function (data) {
        io.sockets.emit(PASS_UPDATED_RECORDS_TO_CLIENT_SIDE, data);
    });
    socket.on(JOIN_ROOM_BY_URL, (room, cb) => {
        let rooms = io.sockets.adapter.sids[socket.id];
        for (let g in rooms) {
            socket.leave(g)
        }
        socket.join(room)
        cb(room)
    })

});

app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use('/webHook', WebHook)
app.use('/records', Records)



