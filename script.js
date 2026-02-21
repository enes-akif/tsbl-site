// CANVAS
const canvas = document.getElementById('bg');

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.z = 25;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// LIGHT
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(50, 50, 50);
scene.add(light);

// ======================
// YILDIZLAR
// ======================

const starsGeometry = new THREE.BufferGeometry();
const starCount = 1500;

const positions = [];

for (let i = 0; i < starCount; i++) {
    positions.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
}

starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    sizeAttenuation: true
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// ======================
// 3D DÜNYA
// ======================

const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load("textures/earth.jpg");

const earthGeometry = new THREE.SphereGeometry(8, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// ======================
// METEOR
// ======================

const meteorTexture = textureLoader.load("textures/meteor.jpg");

const meteorGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const meteorMaterial = new THREE.MeshStandardMaterial({
    map: meteorTexture,
    emissive: 0xff5500,
    emissiveIntensity: 1
});

let meteor;

function createMeteor() {
    meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    meteor.position.set(
        -200,
        Math.random() * 50 - 25,
        Math.random() * 50 - 25
    );

    scene.add(meteor);

    let progress = 0;

    function moveMeteor() {
        progress += 0.002; // YAVAŞ

        meteor.position.x += 1.5;
        meteor.position.y -= 0.3;

        if (meteor.position.x > 0) {
            scene.remove(meteor);
            setTimeout(createMeteor, 15000);
        } else {
            requestAnimationFrame(moveMeteor);
        }
    }

    moveMeteor();
}

// İlk meteor 5 saniye sonra başlasın
setTimeout(createMeteor, 5000);

// ======================
// RESIZE FIX
// ======================

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ======================
// ANIMATE
// ======================

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    renderer.render(scene, camera);
}

animate();