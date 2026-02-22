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
   THREE SCENE
========================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(500, 500);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("earth-container").appendChild(renderer.domElement);

camera.position.z = 6;

/* LIGHT */
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);

/* =========================
   BLOOM SETUP
========================= */

const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(500, 500),
    1.5,   // strength
    0.4,   // radius
    0.2    // threshold
);
composer.addPass(bloomPass);

/* =========================
   EARTH (%30 BÜYÜK)
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

/* =========================
   METEOR
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const size = 0.07 + Math.random() * 0.05;

    const meteor = new THREE.Mesh(
        new THREE.IcosahedronGeometry(size, 1),
        new THREE.MeshStandardMaterial({
            map: meteorTexture,
            roughness: 1
        })
    );

    const angle = Math.random() * Math.PI * 2;
    const radius = 20;

    meteor.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius
    );

    meteor.userData = {
        direction: new THREE.Vector3()
            .subVectors(new THREE.Vector3(0,0,0), meteor.position)
            .normalize(),
        speed: 0.03 + Math.random() * 0.02,
        trail: []
    };

    scene.add(meteor);
    meteors.push(meteor);
}

setInterval(spawnMeteor, 3000);

/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const explosion = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 1
        })
    );

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

    meteors.forEach((meteor, index) => {

        meteor.position.add(
            meteor.userData.direction.clone().multiplyScalar(meteor.userData.speed)
        );

        meteor.rotation.x += 0.05;
        meteor.rotation.y += 0.04;

        // 🔥 Trail
        const trail = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 8, 8),
            new THREE.MeshBasicMaterial({
                color: 0xff5500,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            })
        );

        trail.position.copy(meteor.position);
        scene.add(trail);

        setTimeout(() => {
            scene.remove(trail);
        }, 300);

        // Çarpma kontrolü
        if (meteor.position.length() < 1.7) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteors.splice(index, 1);
        }

        // Atmosferi ıskalayanlar
        if (meteor.position.length() > 40) {
            scene.remove(meteor);
            meteors.splice(index, 1);
        }

    });

    composer.render();
}

animate();