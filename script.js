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

const camera = new THREE.PerspectiveCamera(
    75,
    500 / 500,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(500, 500);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("earth-container").appendChild(renderer.domElement);

camera.position.z = 6;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);

/* =========================
   BLOOM (JÜRİ MODU)
========================= */

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

/* =========================
   EARTH (%30 BÜYÜK)
========================= */

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("earth.png");

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);

scene.add(earth);

/* =========================
   METEOR SYSTEM
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const size = Math.random() * 0.08 + 0.05; // ultra küçük

    const geometry = new THREE.IcosahedronGeometry(size, 1);

    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.2
    });

    const meteor = new THREE.Mesh(geometry, material);

    const startX = (Math.random() - 0.5) * 8;
    const startY = (Math.random() - 0.5) * 8;

    meteor.position.set(startX, startY, -25);

    const direction = new THREE.Vector3(
        -startX,
        -startY,
        25
    ).normalize();

    const hitEarth = Math.random() > 0.3;

    meteor.userData = {
        direction: direction,
        speed: 0.05,
        hitEarth: hitEarth,
        trail: []
    };

    scene.add(meteor);
    meteors.push(meteor);
}

setInterval(spawnMeteor, 4000);

/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.4, 32, 32);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);

    scene.add(explosion);

    let scale = 0.5;

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
   ANIMATE
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    meteors.forEach((meteor, index) => {

        meteor.position.add(
            meteor.userData.direction
                .clone()
                .multiplyScalar(meteor.userData.speed)
        );

        meteor.rotation.x += 0.05;
        meteor.rotation.y += 0.04;

        // 🔥 ULTRA TRAIL
        const trailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0xff5500,
            transparent: true,
            opacity: 0.8
        });

        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.copy(meteor.position);
        scene.add(trail);

        meteor.userData.trail.push(trail);

        if (meteor.userData.trail.length > 20) {
            const old = meteor.userData.trail.shift();
            scene.remove(old);
        }

        // Çarpma
        if (meteor.userData.hitEarth &&
            meteor.position.length() < 2.3) {

            createExplosion(meteor.position.clone());

            meteor.userData.trail.forEach(t => scene.remove(t));
            scene.remove(meteor);
            meteors.splice(index, 1);
        }

        // Iskala
        if (!meteor.userData.hitEarth &&
            meteor.position.z > 5) {

            meteor.userData.trail.forEach(t => scene.remove(t));
            scene.remove(meteor);
            meteors.splice(index, 1);
        }
    });

    composer.render();
}

animate();