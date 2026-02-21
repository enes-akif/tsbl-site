/* =========================
   STARS (DOKUNMUYORUZ)
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 650;
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
   THREE SAHNE
========================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(500, 500);
document.getElementById("earth-container").appendChild(renderer.domElement);
camera.position.z = 5;

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0xffffff, 1.4);
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
   METEOR ULTRA SİSTEM
========================= */

let meteor, trail;

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    // 🔹 Meteor küçüldü
    const geometry = new THREE.IcosahedronGeometry(0.15, 2);
    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1
    });

    meteor = new THREE.Mesh(geometry, material);

    // 🔹 Daha uzaktan başlıyor
    const angle = Math.random() * Math.PI * 2;
    const distance = 15;

    meteor.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        -5
    );

    scene.add(meteor);

    // 🔥 SHADER ALEVLİ KUYRUK
    const trailGeometry = new THREE.ConeGeometry(0.12, 1.2, 32);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.8
    });

    trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trail.position.set(0, -0.6, 0);
    trail.rotation.x = Math.PI;
    meteor.add(trail);
}

/* =========================
   PATLAMA + ATMOSFER
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
   METEOR TIMER
========================= */

setInterval(spawnMeteor, 6000);

/* =========================
   ANİMASYON
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        // 🔹 Daha yavaş yaklaşım
        meteor.position.x *= 0.985;
        meteor.position.y *= 0.985;
        meteor.position.z += 0.02;

        meteor.rotation.x += 0.08;
        meteor.rotation.y += 0.06;

        // 🌍 Atmosfere girişte glow artışı
        if (meteor.position.length() < 5 && trail) {
            trail.material.opacity = 1;
        }

        if (meteor.position.length() < 1.5) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();