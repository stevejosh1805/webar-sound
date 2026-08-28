const params = new URLSearchParams(location.search);
const id = params.get('car') || 'porsche911';
let car;

fetch('data/cars.json')
  .then(r => r.json())
  .then(data => {
    car = data[id];
    if (!car) {
      document.getElementById('gate-title').textContent = 'Unknown car';
      return;
    }
    document.getElementById('gate-title').textContent = car.name;
    document.getElementById('gate-engine').textContent = car.engine;
    document.getElementById('snd').src = car.audio;
    document.getElementById('mv').src = car.model;
  })
  .catch(() => {
    document.getElementById('gate-title').textContent = 'Could not load car data';
  });

document.getElementById('start').addEventListener('click', () => {
  const snd = document.getElementById('snd');
  snd.play().catch(err => console.warn('audio blocked', err));
  document.getElementById('gate').hidden = true;
  document.getElementById('stage').hidden = false;
  document.getElementById('info').innerHTML =
    `<strong>${car.name}</strong><br>${car.engine}<br><em>${car.note}</em>`;
});

document.getElementById('replay').addEventListener('click', () => {
  const snd = document.getElementById('snd');
  snd.currentTime = 0;
  snd.play();
});
