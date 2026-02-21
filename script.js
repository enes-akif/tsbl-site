/* ======================
   SCENE
====================== */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(500, 500);
renderer.setClearColor(0x000000, 0); // siyahı bozmaz
document.getElementById("earth-container").appendChild(renderer.domElement);

/* ======================
   YILDIZ ALANI
====================== */

const starsGeometry = new THREE.BufferGeometry();
const starCount = 2000;

const starPositions = [];

for (let i = 0; i < starCount; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
}

starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

/* ======================
   DÜNYA
====================== */

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("earth.jpg");

const geometry = new THREE.SphereGeometry(1, 64, 64);

const material = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

camera.position.z = 5;

/* ======================
   ANIMATE
====================== */

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;
    starField.rotation.y += 0.0005; // yıldızlar hafif dönsün

    renderer.render(scene, camera);
}

animate();

/* ======================
   DROPDOWN FIX
====================== */

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