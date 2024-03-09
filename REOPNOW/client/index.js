const ipcRenderer = require('electron').ipcRenderer;
var name = "";
window.onload = function () {
    ipcRenderer.on("uuid", (event, data) => {
        document.getElementById("code").innerHTML = data;
    })
    ipcRenderer.on("messages", (event, data) => {
        var chatBox = document.getElementById("chatBox");
        var div = document.createElement('div');
        div.innerHTML += `<p style="color: rgb(68, 68, 68);margin:5px 0px;font-size: 14px;">${data.name}</p><p style="margin-left: 10px;
        padding: 5px;
        background-color: white;
        box-shadow: 0px 0px 5px rgb(175, 173, 173);
        border-radius: 5px 0px;
        max-width: 200px;
        width: max-content;
        text-warp: break-word;
        word-break: break-word;
        margin: 0px;">${data.message}</p>`;
        chatBox.appendChild(div);
    })
}

function handleInputChange() {
    var message = document.getElementById("message").value;
    console.log(message);
}

function handleChange() {
    var message = document.getElementById("inputName").value;

}

function sendMessage() {
    var message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    ipcRenderer.send("send-message", {
        name: name,
        message: message
    });

}

function startShare() {
    name = document.getElementById("inputName").value;
    if (name === "") {
        document.getElementById("warning").innerHTML = "Please enter your name";
        return;
    }
    document.getElementById("warning").innerHTML = "";
    ipcRenderer.send("start-share", {
        name: name
    });
    document.getElementById("start").style.display = "none";
    document.getElementById("inputName").style.display = "none";
    document.getElementById("stop").style.display = "block";
    document.getElementById("code").style.display = "block";
    document.getElementById("code_note").style.display = "block";
    document.getElementById("chatContainer").style.display = "block";
    document.getElementById("pause").style.display = "block";
}

function pauseShare() {
    
}

function stopShare() {
    ipcRenderer.send("stop-share", {});
    document.getElementById("chatBox").innerHTML ="";
    document.getElementById("stop").style.display = "none";
    document.getElementById("start").style.display = "block";
    document.getElementById("inputName").style.display = "block";
    document.getElementById("code").style.display = "none";
    document.getElementById("code_note").style.display = "none";
    document.getElementById("chatContainer").style.display = "none";
    document.getElementById("pause").style.display = "none";
}