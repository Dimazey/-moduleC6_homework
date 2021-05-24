const url = 'wss://echo.websocket.org/';
const inputText = document.querySelector('input');
const sendButt = document.querySelector('#j-send-butt');
const getLocation = document.querySelector('#j-coord-butt');
const chatDiv = document.querySelector('.j-chat');

let websocket = new WebSocket(url);

websocket.onopen = (evt)=> {
    window.onbeforeunload = ()=> {
    websocket.close();
    websocket = null;
    }
}

websocket.onerror = (evt)=> {console.log(evt.data)
    showMessage('<span style="color: red;">ERROR:</span> ' + evt.data, true);
}

sendButt.addEventListener('click', () => {
    sendButt.style.backgroundColor = '#0673A1';
    setTimeout(()=> sendButt.style.backgroundColor = '#4ED5FC', 120)

    let sendMessage = inputText.value;
    requestServer(sendMessage);
    websocket.onmessage = function(evt) {
        showMessage(evt.data, true);
    }
});

getLocation.addEventListener('click', () => {
    getLocation.style.backgroundColor = '#0673A1';
    setTimeout(()=> getLocation.style.backgroundColor = '#4ED5FC', 120);
    requestPosition();
});

function  showMessage(text, param) {
    let pre = document.createElement('p');
    pre.innerHTML = text;
    if (param) {
        pre.classList.add('server-message');
        }
    chatDiv.appendChild(pre);
}

function requestServer(message) {
    if (!websocket.readyState) {showMessage('<span style="color: red;">' +
        'Still in CONNECTING state. Please try to send message again.</span>', true)}
    else {showMessage(message, false);
        websocket.send(message);}
}

const success = (position) => {
    let mapLink = `<a href="https://www.openstreetmap.org/#map=18/${position.coords.latitude}/${position.coords.longitude}" target="_blank" style="color: #4ED5FC; text-decoration: none;">Гео-локация</a>`;
    showMessage(mapLink, false);
}

function requestPosition() {
    if (!navigator.geolocation) {
        showMessage('<span style="color: red;">Ошибка. Навигация не поддерживается вашим устройством</span>', true);
    } else {
        navigator.geolocation.getCurrentPosition(success);
    }
}




