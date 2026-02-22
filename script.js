/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    for (let i = 0; i < 400; i++) {
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

const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);


/* =========================
   LIGHT
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);


/* =========================
   EARTH ( %30 BÜYÜTÜLDÜ )
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const EARTH_RADIUS = 1.3 * 1.3; // %30 büyük

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);


/* =========================
   METEOR SYSTEM
========================= */

let meteor = null;
let meteorDirection = new THREE.Vector3();
let meteorSpeed = 0;
let tailParticles = [];
let willHit = true;

function spawnMeteor() {

    if (meteor) return;

    const meteorTexture = loader.load("meteor.jpg");

    // ⭐ YILDIZDAN 3 KAT BÜYÜK AMA ULTRA KÜÇÜK
    const size = Math.random() * 0.03 + 0.03; // 0.03 - 0.06

    const geometry = new THREE.IcosahedronGeometry(size, 2);
    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.2
    });

    meteor = new THREE.Mesh(geometry, material);

    const angle = Math.random() * Math.PI * 2;
    const radius = 25;

    meteor.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius
    );

    // %65 çarpacak, %35 ıskalayacak
    willHit = Math.random() < 0.65;

    if (willHit) {
        meteorDirection = new THREE.Vector3()
            .subVectors(new THREE.Vector3(0, 0, 0), meteor.position)
            .normalize();
    } else {
        // Biraz saptır
        const missOffset = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );

        meteorDirection = new THREE.Vector3()
            .subVectors(meteor.position.clone().add(missOffset), meteor.position)
            .normalize();
    }

    meteorSpeed = Math.random() * 0.015 + 0.015; // Yavaş

    scene.add(meteor);
}

setInterval(spawnMeteor, 12000);


/* =========================
   FIRE PARTICLE
========================= */

function createFireParticle(position) {

    const geometry = new THREE.SphereGeometry(0.03, 6, 6);

    const material = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
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

    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.25;

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
   RESIZE
========================= */

window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
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

        // 🔥 Kuyruk
        for (let i = 0; i < 3; i++) {
            createFireParticle(meteor.position.clone());
        }

        for (let i = tailParticles.length - 1; i >= 0; i--) {
            const p = tailParticles[i];
            p.material.opacity -= 0.04;
            p.scale.multiplyScalar(0.96);

            if (p.material.opacity <= 0) {
                scene.remove(p);
                tailParticles.splice(i, 1);
            }
        }

        // Çarpma
        if (willHit && meteor.position.length() < EARTH_RADIUS + 0.1) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
            tailParticles.forEach(p => scene.remove(p));
            tailParticles = [];
        }

        // Iskalama → uzaya çıkınca sil
        if (!willHit && meteor.position.length() > 40) {
            scene.remove(meteor);
            meteor = null;
            tailParticles.forEach(p => scene.remove(p));
            tailParticles = [];
        }
    }

    renderer.render(scene, camera);
}

animate();