//import to client side


import io from 'socket.io-client'

const socket = io('http://localhost:2777')
socket.on('connect', () => console.log('connected to websocket'))

export const receivingData = (cb) => socket.on('PASS_UPDATED_RECORDS_TO_CLIENT_SIDE', (data) => cb && cb(data))

export const joinRoom = room => socket.emit('JOIN_ROOM_BY_URL', room, res => console.log(res))

export const publishFeed = (feed) => socket.emit('publish_feed', feed);

