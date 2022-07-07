module.exports = (socket, res, next) => {
    if (!socket.req) {
        return socket.emit('requires login');
    }

    next();
}