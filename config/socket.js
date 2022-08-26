const socket = (socket) => {
    socket.on("join room", (projectNum) => {
        socket.join(projectNum);
    });

    socket.on("send:message", (msg) => {
        socket.to(`${msg.projectNum}`).emit("receive:message", msg);
    });
    
}

module.exports = socket;