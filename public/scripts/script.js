const socket = io()

let form = document.getElementById('form')
let input = document.getElementById('input')
let messages = document.getElementById('messages')

form.addEventListener('submit', e => {
    e.preventDefault()

    if (input.value) {
        // console.log('Sending message: ' + input.value)
        socket.emit('chat message', input.value)
    }

    input.value = ''
})

socket.on('chat message', message => {
    let item = document.createElement('li')
    item.textContent = message

    messages.appendChild(item)

    // console.log(message)
})




const btn = document.getElementById('submit');
let by = document.getElementById('by');
let content = document.getElementById('content');
const form = document.getElementById('form');
form.addEventListener('keyup', (e) => {
  by.value === '' || content.value === ''
    ? (btn.disabled = true)
    : (btn.disabled = false);
});
