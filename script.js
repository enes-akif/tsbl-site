/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 400;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        const size = Math.random() * 1 + 0.5;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";
        starContainer.appendChild(star);
    }
}
createStars();

/* =========================
   THREE SETUP
========================= */

const scene = new THREE.Scene();

const container = document.getElementById("earth-container");
const width = container.clientWidth;
const height = container.clientHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

/* =========================
   BLOOM (DÜNYA GİTMEZ)
========================= */

const renderScene = new THREE.RenderPass(scene, camera);

const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.2,
    0.6,
    0.85
);

const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

/* =========================
   LIGHTS
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);

/* =========================
   EARTH (BÜYÜTÜLMÜŞ %30)
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);

scene.add(earth);

/* =========================
   METEOR SYSTEM
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const size = Math.random() * 0.07 + 0.05; // küçük meteor
    const geometry = new THREE.IcosahedronGeometry(size, 1);

    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1
    });

    const meteor = new THREE.Mesh(geometry, material);

    const startDistance = 20;

    const angle = Math.random() * Math.PI * 2;
    meteor.position.set(
        Math.cos(angle) * startDistance,
        Math.sin(angle) * startDistance,
        -startDistance
    );

    meteor.userData.direction = new THREE.Vector3(
        -meteor.position.x,
        -meteor.position.y,
        startDistance
    ).normalize();

    meteor.userData.speed = 0.02 + Math.random() * 0.015;

    // 🔥 ULTRA ALEV KUYRUK
    const flameMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/fire.png"),
        color: 0xff5500,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    const flame = new THREE.Sprite(flameMaterial);
    flame.scale.set(0.5, 0.5, 1);
    meteor.add(flame);

    meteor.userData.flame = flame;

    scene.add(meteor);
    meteors.push(meteor);
}

setInterval(spawnMeteor, 4000);

/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.2;

    const explode = setInterval(() => {
        scale += 0.15;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.04;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }
    }, 30);
}

/* =========================
   ANIMATE
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    meteors.forEach((meteor, index) => {

        meteor.position.add(
            meteor.userData.direction.clone().multiplyScalar(meteor.userData.speed)
        );

        meteor.rotation.x += 0.02;
        meteor.rotation.y += 0.02;

        // %70 çarpma, %30 ıskalama
        if (meteor.position.length() < 1.8 && Math.random() > 0.3) {

            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteors.splice(index, 1);
        }

        // Atmosferden çıkarsa sil
        if (meteor.position.length() > 25) {
            scene.remove(meteor);
            meteors.splice(index, 1);
        }
    });

    composer.render();
}

animate();

/* =========================
   RESPONSIVE (DÜNYA GİTMEZ)
========================= */

window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
});