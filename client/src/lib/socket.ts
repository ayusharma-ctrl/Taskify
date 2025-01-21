import { io, Socket } from 'socket.io-client';

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
});

export default socket;