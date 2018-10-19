//import on client side

import io from 'socket.io-client'
const socket = io('http://localhost:4000')
socket.on('connect',()=>console.log('connected to websocket'))

export const receivingFeed = ()=> socket.on('sending_feed_to_another_site', data=>{     console.log(data)});

export const publishFeed = (feed)=>socket.emit('publish_feed', feed);

