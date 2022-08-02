module.exports = (socket, next) => {
    console.log('cookie is set: ' + socket.handshake.headers.cookie);

    if (!socket.handshake.headers.cookie) {
        return socket.emit('requires login');
    }

    next();
}