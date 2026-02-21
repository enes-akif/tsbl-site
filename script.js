/* =========================
   FULL SCREEN STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 900;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1.5 + 0.5;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";

        starContainer.appendChild(star);
    }
}
createStars();

/* =========================
   THREE JS EARTH
========================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(500, 500);
document.getElementById("earth-container").appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("earth.jpg");

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

camera.position.z = 3;

/* =========================
   METEOR SYSTEM
========================= */

let meteor = null;
let explosion = null;

function spawnMeteor() {

    const meteorGeometry = new THREE.IcosahedronGeometry(0.15, 1);
    const meteorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 2
    });

    meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    // Rastgele başlangıç açısı
    const angle = Math.random() * Math.PI * 2;
    const distance = 6;

    meteor.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        -2
    );

    scene.add(meteor);
}

function createExplosion(position) {

    const explosionGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1
    });

    explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.1;

    const explodeInterval = setInterval(() => {
        scale += 0.1;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.05;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            explosion = null;
            clearInterval(explodeInterval);
        }
    }, 30);
}

setInterval(spawnMeteor, 6000);

/* =========================
   ANIMATION LOOP
========================= */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    if (meteor) {
        meteor.position.x *= 0.96;
        meteor.position.y *= 0.96;

        // Dünya merkezine yeterince yaklaştıysa
        if (meteor.position.length() < 1.2) {
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