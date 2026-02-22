/* =========================
   STAR BACKGROUND
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

const container = document.getElementById("earth-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


/* =========================
   BLOOM (SAFE)
========================= */

const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    1.5,   // strength
    0.4,   // radius
    0.85   // threshold
);
composer.addPass(bloomPass);


/* =========================
   LIGHTS
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1.4);
light.position.set(5, 3, 5);
scene.add(light);


/* =========================
   EARTH (ASLA KAYBOLMAZ)
========================= */

const loader = new THREE.TextureLoader();

loader.load(
    "earth.jpg",
    function(texture) {

        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(1.7, 64, 64),
            new THREE.MeshStandardMaterial({ map: texture })
        );

        scene.add(earth);

        // Dünya animasyonu
        function animate() {
            requestAnimationFrame(animate);

            earth.rotation.y += 0.002;

            composer.render();
        }

        animate();
    },
    undefined,
    function(err){
        console.error("Earth texture yüklenemedi!", err);
    }
);


/* =========================
   RESIZE FIX
========================= */

window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    composer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});