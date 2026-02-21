// SAHNE
const scene = new THREE.Scene();

// KAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 100;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
// IŞIKLAR
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(200, 200, 200);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// 3D DÜNYA (Texture yok – stabil sürüm)
const geometry = new THREE.SphereGeometry(30, 64, 64);

const material = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    metalness: 0.3,
    roughness: 0.7
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// YILDIZLAR
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 3000; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800
    );
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ANİMASYON
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.003;

    renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});
