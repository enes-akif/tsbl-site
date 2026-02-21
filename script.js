// ==============================
// SAHNE KURULUMU
// ==============================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


// ==============================
// IŞIKLAR
// ==============================

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);


// ==============================
// YILDIZLAR (TÜM EKRAN)
// ==============================

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2500;

const positions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 400;
}

starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.6,
  transparent: true
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


// ==============================
// MOUSE PARALLAX
// ==============================

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) - 0.5;
  mouseY = (event.clientY / window.innerHeight) - 0.5;
});


// ==============================
// DÜNYA
// ==============================

const earthGeometry = new THREE.SphereGeometry(4, 64, 64);

const earthMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("earth.jpg"),
  roughness: 1,
  metalness: 0
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);


// ==============================
// METEOR SİSTEMİ
// ==============================

function createMeteor() {

  const geometry = new THREE.SphereGeometry(0.3, 32, 32);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffaa55,
    emissive: 0xff5500,
    emissiveIntensity: 2,
    roughness: 0.4,
    metalness: 0.2
  });

  const meteor = new THREE.Mesh(geometry, material);

  meteor.position.set(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20,
    -60
  );

  scene.add(meteor);

  const target = new THREE.Vector3(0, 0, 0);
  const direction = target.clone().sub(meteor.position).normalize();

  const speed = 0.04; // Yavaş meteor

  function animateMeteor() {

    meteor.position.add(direction.clone().multiplyScalar(speed));

    if (meteor.position.distanceTo(target) < 4) {
      createExplosion(meteor.position);
      scene.remove(meteor);
      return;
    }

    requestAnimationFrame(animateMeteor);
  }

  animateMeteor();
}


// ==============================
// PATLAMA EFEKTİ
// ==============================

function createExplosion(position) {

  const geometry = new THREE.SphereGeometry(1.2, 32, 32);

  const material = new THREE.MeshBasicMaterial({
    color: 0xff3300,
    transparent: true,
    opacity: 0.8
  });

  const explosion = new THREE.Mesh(geometry, material);
  explosion.position.copy(position);

  scene.add(explosion);

  let scale = 1;

  function expand() {
    scale += 0.1;
    explosion.scale.set(scale, scale, scale);
    explosion.material.opacity -= 0.03;

    if (explosion.material.opacity <= 0) {
      scene.remove(explosion);
      return;
    }

    requestAnimationFrame(expand);
  }

  expand();
}


// 15 saniyede bir meteor
setInterval(createMeteor, 15000);


// ==============================
// ANİMASYON DÖNGÜSÜ
// ==============================

function animate() {

  requestAnimationFrame(animate);

  // Dünya dönüş
  earth.rotation.y += 0.002;

  // Mouse parallax
  stars.rotation.y += mouseX * 0.0005;
  stars.rotation.x += mouseY * 0.0005;

  renderer.render(scene, camera);
}

animate();


// ==============================
// RESPONSIVE
// ==============================

window.addEventListener("resize", () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});