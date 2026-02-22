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

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(500, 500);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("earth-container")
    .appendChild(renderer.domElement);

camera.position.z = 6;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 3, 5);
scene.add(light);

/* =========================
   EARTH (GARANTİLİ)
========================= */

const loader = new THREE.TextureLoader();

const earthTexture = loader.load(
    "earth.png",
    undefined,
    undefined,
    function () {
        console.error("earth.png yüklenemedi!");
    }
);

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 64, 64),
    new THREE.MeshStandardMaterial({
        map: earthTexture
    })
);

scene.add(earth);

/* =========================
   METEOR SYSTEM
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const size = Math.random() * 0.07 + 0.05;

    const geometry =
        new THREE.IcosahedronGeometry(size, 1);

    const material =
        new THREE.MeshStandardMaterial({
            map: meteorTexture
        });

    const meteor =
        new THREE.Mesh(geometry, material);

    const startX = (Math.random() - 0.5) * 6;
    const startY = (Math.random() - 0.5) * 6;

    meteor.position.set(startX, startY, -25);

    const direction =
        new THREE.Vector3(-startX, -startY, 25)
            .normalize();

    meteor.userData = {
        direction: direction,
        speed: 0.03,
        hitEarth: Math.random() > 0.3,
        trail: []
    };

    scene.add(meteor);
    meteors.push(meteor);
}

setInterval(spawnMeteor, 5000);

/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const geometry =
        new THREE.SphereGeometry(0.4, 16, 16);

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 1
        });

    const explosion =
        new THREE.Mesh(geometry, material);

    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.5;

    const interval = setInterval(() => {
        scale += 0.3;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.05;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(interval);
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

        meteor.rotation.x += 0.03;
        meteor.rotation.y += 0.03;

        // TRAIL
        const trail =
            new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0xff5500,
                    transparent: true,
                    opacity: 0.6
                })
            );

        trail.position.copy(meteor.position);
        scene.add(trail);

        meteor.userData.trail.push(trail);

        if (meteor.userData.trail.length > 15) {
            const old = meteor.userData.trail.shift();
            scene.remove(old);
        }

        // Çarpma
        if (meteor.userData.hitEarth &&
            meteor.position.length() < 2.1) {

            createExplosion(meteor.position.clone());

            meteor.userData.trail
                .forEach(t => scene.remove(t));

            scene.remove(meteor);
            meteors.splice(index, 1);
        }

        // Iskala
        if (!meteor.userData.hitEarth &&
            meteor.position.z > 5) {

            meteor.userData.trail
                .forEach(t => scene.remove(t));

            scene.remove(meteor);
            meteors.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

animate();