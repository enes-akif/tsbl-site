/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 450;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1 + 0.4;
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
const container = document.getElementById("earth-container");

const width = container.clientWidth;
const height = container.clientHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);


/* =========================
   LIGHT
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
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
   METEOR SYSTEM
========================= */

let meteor = null;
let tailParticles = [];
let meteorDirection = new THREE.Vector3();
let meteorSpeed = 0;

function spawnMeteor() {

    if (meteor) return;

    const meteorTexture = loader.load("meteor.jpg");

    // 🔹 Küçük-Orta arası rastgele boyut
    const size = Math.random() * 0.15 + 0.15; // 0.15 - 0.30 arası

    const geometry = new THREE.IcosahedronGeometry(size, 2);
    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1
    });

    meteor = new THREE.Mesh(geometry, material);

    const angle = Math.random() * Math.PI * 2;
    const radius = 25;

    meteor.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius
    );

    meteorDirection = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), meteor.position)
        .normalize();

    // 🔹 Daha yavaş hız
    meteorSpeed = Math.random() * 0.03 + 0.03; // 0.03 - 0.06

    scene.add(meteor);
}

setInterval(spawnMeteor, 15000);


/* =========================
   TAIL PARTICLE
========================= */

function createTailParticle(position) {

    const geometry = new THREE.SphereGeometry(0.05, 6, 6);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.9
    });

    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(position);

    scene.add(particle);
    tailParticles.push(particle);
}


/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.3;

    const explode = setInterval(() => {
        scale += 0.25;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.05;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }
    }, 30);
}


/* =========================
   RESIZE FIX
========================= */

window.addEventListener("resize", () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});


/* =========================
   ANIMATION
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        meteor.position.add(
            meteorDirection.clone().multiplyScalar(meteorSpeed)
        );

        meteor.rotation.x += 0.02;
        meteor.rotation.y += 0.02;

        createTailParticle(meteor.position.clone());

        // 🔹 Kuyruk fade
        for (let i = tailParticles.length - 1; i >= 0; i--) {
            const p = tailParticles[i];
            p.material.opacity -= 0.03;

            if (p.material.opacity <= 0) {
                scene.remove(p);
                tailParticles.splice(i, 1);
            }
        }

        // 🔹 Çarpma
        if (meteor.position.length() < 1.5) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;

            // 🔥 Patlamada kalan tüm kuyrukları temizle
            tailParticles.forEach(p => scene.remove(p));
            tailParticles = [];
        }
    }

    renderer.render(scene, camera);
}

animate();