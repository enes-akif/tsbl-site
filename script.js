// SAHNE
const scene = new THREE.Scene();

// KAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.z = 120;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

// IŞIKLAR
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(200, 200, 200);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 3D DÜNYA
const earthGeometry = new THREE.SphereGeometry(30, 64, 64);

const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e5eff,
    metalness: 0.3,
    roughness: 0.7
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// YILDIZLAR
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
const starCount = 4500;

for (let i = 0; i < starCount; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 900,
        (Math.random() - 0.5) * 900,
        (Math.random() - 0.5) * 900
    );
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

// Mouse Parallax
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

// METEOR
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
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        -700
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

setInterval(() => {
    if (!meteorActive) createMeteor();
}, 6000);

// ANİMASYON
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    updateStars();
    updateMeteor();

    renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
