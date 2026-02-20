// THREE JS SAHNE
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 80;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


// -------------------------
// ⭐ GERÇEKÇİ YILDIZ SİSTEMİ
// -------------------------

const starCount = 3500;
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < starCount; i++) {

    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;

    starVertices.push(x, y, z);
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


// -------------------------
// 🖱 MOUSE PARALLAX
// -------------------------

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


// -------------------------
// 🌍 BASİT DÜNYA (geçici)
// -------------------------

const geometry = new THREE.SphereGeometry(30, 64, 64);

const material = new THREE.MeshStandardMaterial({
    color: 0x3366ff
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);


// IŞIK
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(100, 100, 100);
scene.add(light);


// -------------------------
// 🎬 ANIMATE
// -------------------------

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    updateStars();

    renderer.render(scene, camera);
}

animate();


// -------------------------
// 📱 RESPONSIVE
// -------------------------

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});
