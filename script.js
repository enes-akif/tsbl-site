/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 450;
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
   THREE SETUP
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
   METEOR SYSTEM (SHOWER)
========================= */

let meteors = [];

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const geometry = new THREE.IcosahedronGeometry(
        0.12 + Math.random() * 0.05,
        1
    );

    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1,
        emissive: 0x000000
    });

    const meteor = new THREE.Mesh(geometry, material);

    // Rastgele uzay noktası
    const directionVector = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    ).normalize();

    meteor.position.copy(directionVector.multiplyScalar(30));

    const direction = new THREE.Vector3()
        .subVectors(earth.position, meteor.position)
        .normalize();

    // Trail
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(150 * 3);
    trailGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(trailPositions, 3)
    );

    const trail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail);

    scene.add(meteor);

    meteors.push({
        mesh: meteor,
        direction: direction,
        speed: 0.05 + Math.random() * 0.03,
        trail: trail,
        trailPositions: trailPositions,
        trailIndex: 0
    });
}


// Meteor Shower interval
setInterval(() => {

    const count = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
        setTimeout(spawnMeteor, i * 1000);
    }

}, 15000);


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
   ANIMATION LOOP
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    meteors.forEach((m, index) => {

        m.mesh.position.add(
            m.direction.clone().multiplyScalar(m.speed)
        );

        m.mesh.rotation.x += 0.05;
        m.mesh.rotation.y += 0.05;

        // Atmosfer parlaması
        if (m.mesh.position.length() < 6) {
            m.mesh.material.emissive.setHex(0xff2200);
        }

        // Trail update
        m.trailPositions.copyWithin(3, 0);
        m.trailPositions[0] = m.mesh.position.x;
        m.trailPositions[1] = m.mesh.position.y;
        m.trailPositions[2] = m.mesh.position.z;
        m.trail.geometry.attributes.position.needsUpdate = true;

        // Çarpışma
        if (m.mesh.position.length() < 1.5) {

            createExplosion(m.mesh.position.clone());

            scene.remove(m.mesh);
            scene.remove(m.trail);

            meteors.splice(index, 1);
        }

    });

    renderer.render(scene, camera);
}

animate();