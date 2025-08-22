const popup = document.getElementById('popup');
const contactBtn = document.getElementById('contactBtn');
const closeBtn = document.getElementById('closeBtn');

contactBtn.addEventListener('click', () => {
  popup.style.display = 'flex'; // show pop-up
});

closeBtn.addEventListener('click', () => {
  popup.style.display = 'none'; // hide pop-up
});

window.addEventListener('click', (e) => {
  if(e.target === popup) {
    popup.style.display = 'none';
  }
});
