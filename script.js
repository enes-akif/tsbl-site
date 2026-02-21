/* =========================
   SABİT YILDIZ ARKA PLAN
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 450; // daha az ama dengeli

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1.2 + 0.4;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.top = Math.random() * 100 + "vh";
        star.style.left = Math.random() * 100 + "vw";

        starContainer.appendChild(star);
    }
}

createStars();


/* =========================
   THREE.JS SAHNE
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


/* =========================
   IŞIKLAR
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0xffffff, 1.4);
light.position.set(5, 3, 5);
scene.add(light);


/* =========================
   DÜNYA
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const earthGeometry = new THREE.SphereGeometry(1.3, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);


// =====================
// METEOR SYSTEM (GARANTİ ÇALIŞAN)
// =====================

function createMeteor() {

    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffaa55,
        emissive: 0xff5500,
        emissiveIntensity: 2,
        roughness: 0.4,
        metalness: 0.2
    });

    const meteor = new THREE.Mesh(geometry, material);

    // Kameranın önünde ama uzakta başlat
    meteor.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        -40
    );

    scene.add(meteor);

    // Hedef: dünyanın merkezi
    const target = new THREE.Vector3(0, 0, 0);

    const direction = target.clone().sub(meteor.position).normalize();

    const speed = 0.05; // Yavaş meteor

    function animateMeteor() {

        meteor.position.add(direction.clone().multiplyScalar(speed));

        // Dünyaya ulaştıysa sil
        if (meteor.position.distanceTo(target) < 1.5) {

            createExplosion(meteor.position);
            scene.remove(meteor);
            return;
        }

        requestAnimationFrame(animateMeteor);
    }

    animateMeteor();
}


// =====================
// PATLAMA
// =====================

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0.8
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);

    scene.add(explosion);

    setTimeout(() => {
        scene.remove(explosion);
    }, 400);
}


// 15 saniyede bir meteor
setInterval(createMeteor, 15000);

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
   ANİMASYON
========================= */

function animate() {

    requestAnimationFrame(animate);

    // Dünya dönüyor
    earth.rotation.y += 0.002;

    if (meteor) {

        meteor.position.add(
            direction.clone().multiplyScalar(meteorSpeed)
        );

        meteor.rotation.x += 0.03;
        meteor.rotation.y += 0.02;

        // Atmosfer etkisi
        if (meteor.position.z > -6 && flame) {
            flame.material.opacity = 1;
            flame.scale.set(1.5, 1.5, 1.5);
        }

        // Çarpışma
        if (meteor.position.z > -1.3) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();