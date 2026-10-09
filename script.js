import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 50, 180);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x667744, 2));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(20, 40, 20);
scene.add(sun);

function block(x, y, z, w, h, d, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color })
  );
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

const ground = block(0, -0.5, 0, 200, 1, 200, 0x36a852);
ground.receiveShadow = true;

const road = block(0, 0.02, 0, 12, 0.04, 180, 0x555555);
road.receiveShadow = true;

for (let z = -85; z < 90; z += 12) {
  block(0, 0.05, z, 0.3, 0.04, 6, 0xffffff);
}

for (let i = 0; i < 12; i++) {
  const x = i % 2 === 0 ? -22 : 22;
  const z = -55 + Math.floor(i / 2) * 19;

  block(x, 3, z, 12, 6, 12, [0xd8c49a, 0xb8c8d8, 0xc6b6a2][i % 3]);
  block(x, 6.5, z, 13, 1, 13, 0x9d3028);
  block(x - 3, 3, z + 6.1, 2, 3, 0x65432c);
  block(x + 2, 4, z + 6.1, 2, 2, 0x77ccee);
}

for (let i = 0; i < 22; i++) {
  const x = (i % 2 === 0 ? -14 : 14) + (i % 3) * 3;
  const z = -85 + i * 8;

  block(x, 1.5, z, 1.5, 3, 1.5, 0x80502c);

  const crown = new THREE.Mesh(
    new THREE.BoxGeometry(4, 4, 4),
    new THREE.MeshLambertMaterial({ color: 0x23823c })
  );
  crown.position.set(x, 4.5, z);
  scene.add(crown);
}

const player = new THREE.Group();
const yellow = new THREE.MeshLambertMaterial({ color: 0xffcc33 });
const blue = new THREE.MeshLambertMaterial({ color: 0x1456bd });
const legs = new THREE.MeshLambertMaterial({ color: 0x35652b });

function part(w, h, d, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  player.add(mesh);
}

part(1, 1, 1, yellow, 0, 2.5, 0);
part(1.1, 1.4, 0.6, blue, 0, 1.3, 0);
part(0.35, 1.2, 0.4, yellow, -0.85, 1.4, 0);
part(0.35, 1.2, 0.4, yellow, 0.85, 1.4, 0);
part(0.4, 1, 0.45, legs, -0.3, 0.5, 0);
part(0.4, 1, 0.45, legs, 0.3, 0.5, 0);

player.position.set(0, 0, 15);
scene.add(player);

for (let i = 0; i < 4; i++) {
  const other = player.clone();
  other.position.set(-8 + i * 5, 0, -8 - i * 6);
  scene.add(other);
}

const keys = {};
addEventListener('keydown', (event) => {
  keys[event.key.toLowerCase()] = true;
});
addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false;
});

let firstPerson = false;
const cameraButton = document.querySelector('#camera');
cameraButton.addEventListener('click', () => {
  firstPerson = !firstPerson;
  cameraButton.textContent = firstPerson ? 'Первое лицо' : 'Третье лицо';
});

const touchPad = document.createElement('div');
touchPad.id = 'touch-pad';
document.body.appendChild(touchPad);

const controls = [
  ['▲', 'w', 2, 1],
  ['◀', 'a', 1, 2],
  ['▼', 's', 2, 2],
  ['▶', 'd', 3, 2],
];

controls.forEach(([label, key, col, row]) => {
  const btn = document.createElement('button');
  btn.className = 'touch-btn';
  btn.textContent = label;
  btn.style.gridColumn = String(col);
  btn.style.gridRow = String(row);
  btn.setAttribute('aria-label', `Двигаться ${key.toUpperCase()}`);

  const setKey = (value) => {
    keys[key] = value;
  };

  btn.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    setKey(true);
  });
  btn.addEventListener('pointerup', () => setKey(false));
  btn.addEventListener('pointercancel', () => setKey(false));
  btn.addEventListener('pointerleave', () => setKey(false));

  touchPad.appendChild(btn);
});

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.16;
  if (keys.w || keys.arrowup) player.position.z -= speed;
  if (keys.s || keys.arrowdown) player.position.z += speed;
  if (keys.a || keys.arrowleft) player.position.x -= speed;
  if (keys.d || keys.arrowright) player.position.x += speed;

  player.position.x = THREE.MathUtils.clamp(player.position.x, -90, 90);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -90, 90);

  if (firstPerson) {
    camera.position.set(player.position.x, player.position.y + 3.1, player.position.z - 0.2);
    camera.lookAt(player.position.x, 2.8, player.position.z - 10);
  } else {
    camera.position.set(player.position.x, player.position.y + 7, player.position.z + 12);
    camera.lookAt(player.position.x, 1.5, player.position.z);
  }

  renderer.render(scene, camera);
}

animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

console.log('Boboblocs is running');
