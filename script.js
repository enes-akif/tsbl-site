/* =========================
   STARS (DEĞİŞMEDİ)
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
   METEOR SİSTEMİ
========================= */

let meteor;
let flame;
let direction;

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const geometry = new THREE.IcosahedronGeometry(0.15, 2);
    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1
    });

    meteor = new THREE.Mesh(geometry, material);

    // 🔹 Sabit doğrultu (dümdüz geliş)
    const startDistance = 25;
    meteor.position.set(0, 0, -startDistance);

    // Dünya merkezine doğru vektör
    direction = new THREE.Vector3(0, 0, 1).normalize();

    scene.add(meteor);

    // 🔥 Gerçekçi Alev (Glow Katmanı)
    const flameGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.6
    });

    flame = new THREE.Mesh(flameGeometry, flameMaterial);
    meteor.add(flame);
}

setInterval(spawnMeteor, 15000); // 🔥 15 saniye

/* =========================
   PATLAMA
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
        scale += 0.4;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.03;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }
    }, 30);
}

/* =========================
   ANİMASYON
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        // 🔹 15 saniyelik yavaş yaklaşım
        meteor.position.add(direction.clone().multiplyScalar(0.15));

        meteor.rotation.x += 0.05;
        meteor.rotation.y += 0.04;

        // 🔥 Atmosfere yaklaşınca alev güçlenir
        if (meteor.position.z > -5 && flame) {
            flame.material.opacity = 1;
            flame.scale.set(1.4, 1.4, 1.4);
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