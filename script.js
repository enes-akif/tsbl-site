/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 500;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1 + 0.3;
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

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(500, 500);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("earth-container")
    .appendChild(renderer.domElement);

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
   METEOR SYSTEM
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const meteor = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.09, 1),
        new THREE.MeshStandardMaterial({
            map: meteorTexture,
            roughness: 1,
            metalness: 0.2,
            emissive: 0x552200,
            emissiveIntensity: 0.6
        })
    );

    const startDir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    ).normalize();

    meteor.position.copy(startDir.multiplyScalar(35));

    const direction = new THREE.Vector3()
        .subVectors(earth.position, meteor.position)
        .normalize();

    scene.add(meteor);

    meteors.push({
        mesh: meteor,
        direction: direction,
        speed: 0.035,
        particles: []
    });
}

setInterval(spawnMeteor, 15000);

/* =========================
   PATLAMA
========================= */

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);

    scene.add(explosion);

    let scale = 0.3;

    const explode = setInterval(() => {

        scale += 0.4;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.05;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }

    }, 30);
}

/* =========================
   PARTICLE FLAME
========================= */

function createFlameParticle(position) {

    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
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

    return particle;
}

/* =========================
   ANIMATE
========================= */

function animate() {

    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    meteors.forEach((m, index) => {

        // meteor movement
        m.mesh.position.add(
            m.direction.clone().multiplyScalar(m.speed)
        );

        // 🔥 flame generation
        const flame = createFlameParticle(m.mesh.position.clone());
        m.particles.push(flame);

        // 🔥 flame fade
        m.particles.forEach((p, i) => {

            p.scale.multiplyScalar(0.96);
            p.material.opacity *= 0.92;

            if (p.material.opacity < 0.05) {
                scene.remove(p);
                m.particles.splice(i, 1);
            }
        });

        m.mesh.rotation.x += 0.05;
        m.mesh.rotation.y += 0.05;

        if (m.mesh.position.length() < 1.5) {

            createExplosion(m.mesh.position.clone());

            scene.remove(m.mesh);
            m.particles.forEach(p => scene.remove(p));

            meteors.splice(index, 1);
        }

    });

    renderer.render(scene, camera);
}

animate();