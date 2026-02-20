/* GERÇEKÇİ YILDIZ SİSTEMİ */

const starCount = 3500;
const starGeometry = new THREE.BufferGeometry();
const positions = [];
const sizes = [];

for (let i = 0; i < starCount; i++) {

    // Daha kompakt ve dengeli dağılım
    positions.push(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
    );

    // Boyut farkı çok az (0.4 - 0.7 arası)
    sizes.push(0.4 + Math.random() * 0.3);
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.6,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

/* MOUSE PARALLAX ETKİSİ */

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {

    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

});

function updateStars() {

    // Mouse'a göre yumuşak hareket
    stars.rotation.y += (mouseX * 0.002 - stars.rotation.y) * 0.02;
    stars.rotation.x += (-mouseY * 0.002 - stars.rotation.x) * 0.02;

}
