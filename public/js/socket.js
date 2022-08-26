const socket = io();

socket.on("receive:message", ({
    message,
    userPhoto,
    userAccount,
    time
}) => {
    const chatBox = $(".chatSendBtn").closest(".chatBox");
    const example = chatBox.find(".messageExample");
    const chatItem = chatBox.find(".chatItem");
    if (example) example.hide();
    chatItem.prepend(`<div class="messageBox">
    <div class="messageTitleBox">
    <h6><img src="${userPhoto}" class="chatAvatar"> ${userAccount}</h6>
    <p class="messageTitleTime">${time}</p></div>
    <p class="messageContent">${message.content}</p></div>`);

    const scrollToheight = chatItem.height();
    chatItem.scrollTop(scrollToheight);
});