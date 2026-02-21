/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 500;
    starContainer.innerHTML = "";

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1 + 0.5;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";

        starContainer.appendChild(star);
    }
}
createStars();


/* =========================
   THREE SCENE
========================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(500, 500);
renderer.setPixelRatio(window.devicePixelRatio);

document
    .getElementById("earth-container")
    .appendChild(renderer.domElement);

camera.position.z = 5;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

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
    new THREE.MeshStandardMaterial({
        map: earthTexture
    })
);

scene.add(earth);


/* =========================
   METEOR SYSTEM (FIXED)
========================= */

let meteor = null;
let direction = null;

function spawnMeteor() {

    if (meteor) return;

    const meteorTexture = loader.load("meteor.jpg");

    const geometry = new THREE.IcosahedronGeometry(0.2, 2);
    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.2
    });

    meteor = new THREE.Mesh(geometry, material);

    // 🔥 Rastgele uzay konumu (küre üzerinde)
    const distance = 30;

    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    meteor.position.x = distance * Math.sin(phi) * Math.cos(theta);
    meteor.position.y = distance * Math.sin(phi) * Math.sin(theta);
    meteor.position.z = distance * Math.cos(phi);

    // Dünya merkezine doğru yön
    direction = meteor.position.clone().normalize().multiplyScalar(-1);

    scene.add(meteor);
}

// İlk meteor hemen gelsin
spawnMeteor();
setInterval(spawnMeteor, 15000);


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

    if (meteor) {

        // YAVAŞ HAREKET
        meteor.position.add(direction.clone().multiplyScalar(0.1));

        meteor.rotation.x += 0.02;
        meteor.rotation.y += 0.02;

        if (meteor.position.length() < 1.5) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();