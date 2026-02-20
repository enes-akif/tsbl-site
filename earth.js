const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
alpha:true,
antialias:true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("earth-container")
.appendChild(renderer.domElement);

/* GEOMETRY */
const geometry = new THREE.SphereGeometry(4, 64, 64);

const material = new THREE.MeshStandardMaterial({
color:0x2266ff
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

/* LIGHT */
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,3,5);
scene.add(light);

camera.position.z = 10;

/* ANIMATE */
function animate(){
requestAnimationFrame(animate);
earth.rotation.y += 0.002;
renderer.render(scene,camera);
}

animate();

/* RESIZE */
window.addEventListener("resize",()=>{
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});