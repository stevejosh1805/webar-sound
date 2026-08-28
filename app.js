const params = new URLSearchParams(location.search);
let allCars = {};
let id = params.get('car') || 'porsche911';
let car;
let audioCtx, analyser, dataArray, srcNode;

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

function initWave() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  srcNode = audioCtx.createMediaElementSource($('snd'));
  srcNode.connect(analyser);
  analyser.connect(audioCtx.destination);
  drawWave();
}

function drawWave() {
  const c = $('wave');
  const ctx = c.getContext('2d');
  c.width = c.offsetWidth;

  function frame() {
    requestAnimationFrame(frame);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, c.width, c.height);
    const n = dataArray.length;
    const bw = c.width / n;
    for (let i = 0; i < n; i++) {
      const h = (dataArray[i] / 255) * c.height;
      ctx.fillStyle = '#ff5a5f';
      ctx.fillRect(i * bw, c.height - h, bw - 2, h);
    }
  }
  frame();
}

$('start').addEventListener('click', () => {
  initWave();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  $('snd').play().catch(e => console.warn('audio blocked', e));
  $('gate').hidden = true;
  $('stage').hidden = false;
  render();
  buildSwitcher();
});

$('replay').addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  $('snd').currentTime = 0;
  $('snd').play();
});
