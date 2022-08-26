$(document).ready((e) => {
    const projectNum = window.location.pathname.split("/")[2];
    socket.emit("join room", projectNum);
});

const messageSend = (e) => {
    const that = $(".chatSendBtn");
    const chatBox = that.closest(".chatBox");
    const example = chatBox.find(".messageExample");
    const chatItem = chatBox.find(".chatItem");
    const newMessageBox = chatBox.find(".newMessageBox");
    const newMessage = newMessageBox.find("input");
    const projectId = that.data("projectid");
    const projectNum = window.location.pathname.split("/")[2];
    if (example) example.remove();
    //post new message to the server
    axios({
            method: "post",
            url: "/create/message",
            data: {
                newMessage: newMessage.val(),
                projectId: projectId
            }
        })
        .then(res => {
            const user = res.data.user;
            const message = res.data.newMessage;
            const date = new Date(message.createdAt);
            let o = new Intl.DateTimeFormat("locales", {
                dateStyle: "short",
                timeStyle: "short"
            });
            const time = o.format(date);
            socket.emit("send:message", {
                message: message,
                userPhoto: user.avatar.avatarPhoto,
                userAccount: user.account,
                time: time,
                projectNum: projectNum
            });
            //prepend new message
            chatItem.prepend(`<div class="messageBox">
        <div class="messageTitleBox">
        <h6><img src="${user.avatar.avatarPhoto}" class="chatAvatar"> ${user.account}</h6>
       <p class="messageTitleTime">${time}</p>
        </div>
        <p class="messageContent"></p></div>`);
            $(".messageContent").first().text(message.content);

            //scroll to the last
            const scrollToheight = chatItem.height();
            chatItem.scrollTop(scrollToheight);
            newMessage.val("");
        });
    e.stopImmediatePropagation();
};

//press send btn and send message if it's valid
$(".chatSendBtn").on("click", (e) => {
if ($(".newMessage").val() != 0) messageSend(e);
});

//press enter and send message if it's valid
$(".newMessage").on("keypress", (e) => {
    if (e.key == "Enter" && $(".newMessage").val() != 0) messageSend(e);
});