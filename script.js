/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 550;
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

const container = document.getElementById("earth-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);


/* =========================
   LIGHTS
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.DirectionalLight(0xffffff, 1.3);
light.position.set(5, 3, 5);
scene.add(light);


/* =========================
   EARTH
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);

scene.add(earth);


/* =========================
   METEOR SYSTEM (UPGRADE)
========================= */

let meteor = null;
let glow = null;
let direction = null;
let trailParticles = [];

function spawnMeteor() {

    if (meteor) return;

    const angle = Math.random() * Math.PI * 2;
    const radius = 35;

    const startPos = new THREE.Vector3(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 8,
        Math.sin(angle) * radius
    );

    direction = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), startPos)
        .normalize();

    // 🌑 KOYU KAYA METEOR
    const meteorGeometry = new THREE.IcosahedronGeometry(0.18, 2);

    const meteorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2b2b2b,
        roughness: 1,
        metalness: 0.2,
        emissive: 0xff4400,
        emissiveIntensity: 0.6
    });

    meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
    meteor.position.copy(startPos);

    scene.add(meteor);

    // 🔥 GLOW KATMANI
    const glowGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    glow = new THREE.Mesh(glowGeometry, glowMaterial);
    meteor.add(glow);
}

spawnMeteor();
setInterval(spawnMeteor, 15000);


/* =========================
   TRAIL
========================= */

function createTrail(position) {

    const geometry = new THREE.SphereGeometry(0.06, 8, 8);

    const material = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(position);

    scene.add(particle);
    trailParticles.push(particle);
}


/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.4, 32, 32);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.4;

    const explode = setInterval(() => {
        scale += 0.4;
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

    if (meteor) {

        meteor.position.add(
            direction.clone().multiplyScalar(0.03)
        );

        meteor.rotation.x += 0.04;
        meteor.rotation.y += 0.05;

        createTrail(meteor.position.clone());

        trailParticles.forEach((p, index) => {
            p.material.opacity -= 0.02;
            p.scale.multiplyScalar(0.97);

            if (p.material.opacity <= 0) {
                scene.remove(p);
                trailParticles.splice(index, 1);
            }
        });

        if (meteor.position.length() < 1.6) {
            createExplosion(meteor.position.clone());
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

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});