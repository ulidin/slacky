const btn = document.getElementById('submit');
let by = document.getElementById('by');
let content = document.getElementById('content');
const form = document.getElementById('form');
form.addEventListener('keyup', (e) => {
  by.value === '' || content.value === ''
    ? (btn.disabled = true)
    : (btn.disabled = false);
});
