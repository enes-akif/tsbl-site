/* =========================
   STARS
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
   THREE SCENE
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
document.getElementById("earth-container")
    .appendChild(renderer.domElement);

camera.position.z = 5;


/* =========================
   LIGHTS
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
   REALISTIC METEOR
========================= */

let meteor = null;
let direction = null;

function spawnMeteor() {

    if (meteor) return;

    const distance = 35;

    const startPos = new THREE.Vector3(
        -20,
        8,
        -distance
    );

    direction = new THREE.Vector3(
        20,
        -8,
        distance
    ).normalize();

    const meteorGroup = new THREE.Group();

    // 🔥 PARLAYAN ÇEKİRDEK
    const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffdd66
        })
    );

    meteorGroup.add(core);

    // 🔥 GLOW
    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xff5500,
            transparent: true,
            opacity: 0.6
        })
    );

    meteorGroup.add(glow);

    // 🔥 PLAZMA KUYRUK
    const tailGeometry = new THREE.CylinderGeometry(
        0.05,
        0.25,
        3,
        32,
        1,
        true
    );

    const tailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = -1.5;
    tail.rotation.x = Math.PI / 2;

    meteorGroup.add(tail);

    meteorGroup.position.copy(startPos);

    meteor = meteorGroup;
    scene.add(meteor);
}

spawnMeteor();
setInterval(spawnMeteor, 20000);


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
   ANIMATION
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        // 🔥 Daha doğal yavaş hız
        meteor.position.add(
            direction.clone().multiplyScalar(0.035)
        );

        meteor.lookAt(earth.position);

        // Atmosfere girince glow artışı
        if (meteor.position.length() < 8) {
            meteor.children[1].material.opacity = 0.9;
        }

        // Çarpışma
        if (meteor.position.length() < 1.6) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();