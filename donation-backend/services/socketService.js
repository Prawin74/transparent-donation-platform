const socketIo = require('socket.io');

let io;

const initsocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000", // Frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initsocket, getIo };
