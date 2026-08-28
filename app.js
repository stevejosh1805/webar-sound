const params = new URLSearchParams(location.search);
let allCars = {};
let id = params.get('car') || 'porsche911';
let car;

const $ = x => document.getElementById(x);

fetch('data/cars.json')
  .then(r => r.json())
  .then(data => {
    allCars = data;
    car = data[id];
    if (!car) { $('gate-title').textContent = 'Unknown car'; return; }
    $('gate-title').textContent = car.name;
    $('gate-engine').textContent = car.engine;
    $('snd').src = car.audio;
    $('mv').src = car.model;
  })
  .catch(() => { $('gate-title').textContent = 'Could not load car data'; });

function buildSwitcher() {
  $('switcher').innerHTML = '';
  Object.keys(allCars).forEach(key => {
    const b = document.createElement('button');
    b.textContent = allCars[key].name;
    b.className = 'chip' + (key === id ? ' active' : '');
    b.onclick = () => switchCar(key);
    $('switcher').appendChild(b);
  });
}

function switchCar(key) {
  id = key;
  car = allCars[key];
  $('snd').src = car.audio;
  $('mv').src = car.model;
  $('snd').play().catch(e => console.warn(e));
  render();
  buildSwitcher();
}

function render() {
  $('info').innerHTML =
    `<strong>${car.name}</strong><br>${car.engine}<br><em>${car.note}</em>`;
}

$('start').addEventListener('click', () => {
  $('snd').play().catch(e => console.warn('audio blocked', e));
  $('gate').hidden = true;
  $('stage').hidden = false;
  render();
  buildSwitcher();
});

$('replay').addEventListener('click', () => {
  $('snd').currentTime = 0;
  $('snd').play();
});
