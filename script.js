// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.z = 120;

// RENDERER (TRANSPARAN)
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// ÖNEMLİ → transparan arka plan
renderer.setClearColor(0x000000, 0);

// IŞIK
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(200, 200, 200);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// 🌍 EARTH
const earthGeometry = new THREE.SphereGeometry(30, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e5eff,
    metalness: 0.3,
    roughness: 0.7
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// ⭐ STARS
const starCount = 4000;
const starGeometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < starCount; i++) {
    positions.push(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 🖱 MOUSE PARALLAX
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

function updateStars() {
    stars.rotation.y += (mouseX * 0.002 - stars.rotation.y) * 0.02;
    stars.rotation.x += (-mouseY * 0.002 - stars.rotation.x) * 0.02;
}

// ☄️ METEOR
let meteor;
let meteorActive = false;

function createMeteor() {

    const geometry = new THREE.SphereGeometry(3, 16, 16);

    const material = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 2
    });

    meteor = new THREE.Mesh(geometry, material);

    meteor.position.set(
        (Math.random() - 0.5) * 700,
        (Math.random() - 0.5) * 700,
        -600
    );

    scene.add(meteor);
    meteorActive = true;
}

function updateMeteor() {
    if (!meteorActive || !meteor) return;

    meteor.position.lerp(new THREE.Vector3(0, 0, 0), 0.0018);

    if (meteor.position.length() < 45) {
        scene.remove(meteor);
        meteorActive = false;
    }
}

function launchMeteor() {
    if (!meteorActive) createMeteor();
}

setInterval(launchMeteor, 6000);

// ANIMATE
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    updateStars();
    updateMeteor();

    renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
