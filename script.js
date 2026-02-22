/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 500;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1 + 0.3;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";

        starContainer.appendChild(star);
    }
}
createStars();

/* =========================
   THREE SCENE
========================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(500, 500);
document.getElementById("earth-container").appendChild(renderer.domElement);
camera.position.z = 5;

/* BLOOM SETUP */

const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(500, 500),
    1.5,
    0.4,
    0.85
);
composer.addPass(bloomPass);

/* LIGHTS */

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.DirectionalLight(0xffffff, 1.8);
light.position.set(5, 3, 5);
scene.add(light);

/* =========================
   EARTH + ATMOSPHERE
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

/* Atmosfer */

const atmosphereGeometry = new THREE.SphereGeometry(1.38, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.15
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

/* =========================
   METEOR SYSTEM
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const geometry = new THREE.IcosahedronGeometry(0.2, 2);
    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1
    });

    const meteor = new THREE.Mesh(geometry, material);

    const angle = Math.random() * Math.PI * 2;
    const radius = 20;

    meteor.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        -20
    );

    const direction = new THREE.Vector3(0, 0, 0)
        .sub(meteor.position)
        .normalize();

    meteor.userData.direction = direction;
    meteor.userData.speed = 0.05;

    scene.add(meteor);
    meteors.push(meteor);
}

setInterval(spawnMeteor, 6000);

/* =========================
   EXPLOSION + SHAKE
========================= */

let shakeIntensity = 0;

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);
    scene.add(explosion);

    shakeIntensity = 0.15;

    let scale = 0.4;

    const explode = setInterval(() => {
        scale += 0.3;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.04;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }
    }, 30);
}

/* =========================
   ANIMATION
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;
    atmosphere.rotation.y += 0.002;

    meteors.forEach((meteor, index) => {

        meteor.position.add(
            meteor.userData.direction.clone().multiplyScalar(meteor.userData.speed)
        );

        meteor.rotation.x += 0.04;
        meteor.rotation.y += 0.03;

        if (meteor.position.length() < 1.5) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteors.splice(index, 1);
        }
    });

    /* CAMERA SHAKE */
    if (shakeIntensity > 0) {
        camera.position.x = (Math.random() - 0.5) * shakeIntensity;
        camera.position.y = (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.9;
    } else {
        camera.position.x = 0;
        camera.position.y = 0;
    }

    composer.render();
}

animate();