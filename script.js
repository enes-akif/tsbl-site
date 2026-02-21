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

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(500, 500);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("earth-container").appendChild(renderer.domElement);

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
    new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);


/* =========================
   REALISTIC METEOR
========================= */

let meteor = null;
let direction = null;

function spawnMeteor() {

    if (meteor) return;

    const distance = 35;

    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const startPos = new THREE.Vector3(
        distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.cos(phi)
    );

    direction = startPos.clone().normalize().multiplyScalar(-1);

    const meteorGroup = new THREE.Group();

    // 🔥 ÇEKİRDEK
    const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffaa33
        })
    );

    meteorGroup.add(core);

    // 🔥 KUYRUK (Glow)
    const tailGeometry = new THREE.ConeGeometry(0.15, 1.5, 32);
    const tailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0.8
    });

    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = -0.9;
    tail.rotation.x = Math.PI;
    meteorGroup.add(tail);

    meteorGroup.position.copy(startPos);

    meteor = meteorGroup;
    scene.add(meteor);
}

spawnMeteor();
setInterval(spawnMeteor, 18000);


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
   ANIMATE
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        // 🔥 DAHA YAVAŞ
        meteor.position.add(direction.clone().multiplyScalar(0.05));

        meteor.lookAt(earth.position);

        if (meteor.position.length() < 1.5) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();