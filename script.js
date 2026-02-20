// SCENE
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.z = 120;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


// ⭐ YILDIZLAR
const starCount = 3500;
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.6,
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
    stars.rotation.y += (mouseX * 0.002 - stars.rotation.y) * 0.03;
    stars.rotation.x += (-mouseY * 0.002 - stars.rotation.x) * 0.03;
}


// 🌍 DÜNYA
const earthGeometry = new THREE.SphereGeometry(30, 64, 64);

const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x3366ff,
    metalness: 0.3,
    roughness: 0.7
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(200, 200, 200);
scene.add(light);


// ☄️ 3D METEOR SİSTEMİ
let meteor = null;

function createMeteor() {

    if (meteor) {
        scene.remove(meteor);
    }

    const geometry = new THREE.SphereGeometry(2.5, 32, 32);

    const material = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff2200,
        emissiveIntensity: 2,
        roughness: 0.5,
        metalness: 0.3
    });

    meteor = new THREE.Mesh(geometry, material);

    // Rastgele başlangıç pozisyonu
    meteor.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        -300
    );

    scene.add(meteor);
}

let meteorActive = false;

function launchMeteor() {
    createMeteor();
    meteorActive = true;
}

setInterval(launchMeteor, 6000);


function updateMeteor() {
    if (!meteorActive || !meteor) return;

    // Dünya merkezine doğru hareket
    meteor.position.lerp(new THREE.Vector3(0, 0, 0), 0.01);

    // Dünya’ya yaklaşınca patlama
    if (meteor.position.length() < 32) {

        scene.remove(meteor);
        meteorActive = false;
    }
}


// 🎬 ANIMATE
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    updateStars();
    updateMeteor();

    renderer.render(scene, camera);
}

animate();


// 📱 RESPONSIVE
window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});
