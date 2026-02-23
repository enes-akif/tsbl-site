const container = document.getElementById("earth-container");

/* =========================
   THREE SETUP
========================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* =========================
   LIGHT
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

/* =========================
   EARTH
========================= */

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("earth.jpg");

const EARTH_RADIUS = 2;

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);

scene.add(earth);

/* =========================
   METEOR
========================= */

let meteor = null;
let direction = new THREE.Vector3();
let speed = 0;
let willHit = true;

function spawnMeteor() {

    if (meteor) return;

    const meteorTexture = loader.load("meteor.jpg");

    const size = Math.random() * 0.1 + 0.08;

    meteor = new THREE.Mesh(
        new THREE.IcosahedronGeometry(size, 2),
        new THREE.MeshStandardMaterial({ map: meteorTexture })
    );

    const angle = Math.random() * Math.PI * 2;
    const radius = 15;

    meteor.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
    );

    willHit = Math.random() < 0.7;

    if (willHit) {
        direction = new THREE.Vector3()
            .subVectors(new THREE.Vector3(0,0,0), meteor.position)
            .normalize();
    } else {
        direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
    }

    speed = 0.03;

    scene.add(meteor);
}

setInterval(spawnMeteor, 8000);

/* =========================
   ANIMATE
========================= */

function animate() {

    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        meteor.position.add(direction.clone().multiplyScalar(speed));

        meteor.rotation.x += 0.05;
        meteor.rotation.y += 0.05;

        if (willHit && meteor.position.length() < EARTH_RADIUS + 0.1) {
            scene.remove(meteor);
            meteor = null;
        }

        if (!willHit && meteor.position.length() > 25) {
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();

/* =========================
   RESIZE
========================= */

window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});