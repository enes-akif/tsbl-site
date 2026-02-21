/* =========================
   FULL SCREEN STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 700;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1.2 + 0.4;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";

        starContainer.appendChild(star);
    }
}
createStars();

/* =========================
   THREE JS SAHNE
========================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(500, 500);
document.getElementById("earth-container").appendChild(renderer.domElement);

camera.position.z = 4;

/* =========================
   IŞIKLAR
========================= */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

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

/* =========================
   METEOR SİSTEMİ
========================= */

let meteor = null;
let meteorTrail = null;

function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const meteorGeometry = new THREE.IcosahedronGeometry(0.25, 2);
    const meteorMaterial = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.1,
        emissive: 0x331100,
        emissiveIntensity: 0.8
    });

    meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    // Rastgele yön
    const angle = Math.random() * Math.PI * 2;
    const distance = 8;

    meteor.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        -2
    );

    scene.add(meteor);

    // ALEV HALO
    const glowGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.6
    });

    meteorTrail = new THREE.Mesh(glowGeometry, glowMaterial);
    meteor.add(meteorTrail);
}

function createExplosion(position) {

    const explosionGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1
    });

    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.1;

    const explode = setInterval(() => {
        scale += 0.2;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.05;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }
    }, 30);
}

setInterval(spawnMeteor, 6000);

/* =========================
   ANİMASYON
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {

        meteor.position.x *= 0.97;
        meteor.position.y *= 0.97;

        meteor.rotation.x += 0.05;
        meteor.rotation.y += 0.04;

        if (meteor.position.length() < 1.5) {
            createExplosion(meteor.position.clone());
            scene.remove(meteor);
            meteor = null;
        }
    }

    renderer.render(scene, camera);
}

animate();

/* =========================
   DROPDOWN FIX
========================= */

document.querySelectorAll(".dropbtn").forEach(button=>{
    button.addEventListener("click", function(e){
        e.stopPropagation();
        const menu = this.nextElementSibling;

        document.querySelectorAll(".dropdown-content").forEach(d=>{
            if(d !== menu){
                d.style.display="none";
            }
        });

        menu.style.display =
            menu.style.display === "flex" ? "none" : "flex";
    });
});

document.addEventListener("click", function(){
    document.querySelectorAll(".dropdown-content").forEach(d=>{
        d.style.display="none";
    });
});