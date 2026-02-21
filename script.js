// SAHNE
const scene = new THREE.Scene();

// KAMERA
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 4;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

// IŞIK
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// TEXTURE YÜKLE
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("earth.jpg");

// DÜNYA
const geometry = new THREE.SphereGeometry(1, 64, 64);

const material = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// YILDIZLAR
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 3000; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ANİMASYON
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});