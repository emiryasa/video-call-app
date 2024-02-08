const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

// Bir kullanıcı bağlandığında
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');

    // Gelen sinyalleri dinle ve diğer istemcilere iletim yap
    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', data => {
        socket.broadcast.emit('answer', data);
    });

    // Bağlantı kesildiğinde
    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
