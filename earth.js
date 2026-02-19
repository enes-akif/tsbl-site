const container = document.getElementById("earth-container");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({ alpha:true });
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff,2);
light.position.set(5,3,5);
scene.add(light);

const geometry = new THREE.SphereGeometry(3,64,64);
const texture = new THREE.TextureLoader().load("images/earth.jpg");

const material = new THREE.MeshStandardMaterial({ map:texture });
const earth = new THREE.Mesh(geometry,material);

scene.add(earth);
camera.position.z = 8;

function animate(){
requestAnimationFrame(animate);
earth.rotation.y += 0.002;
renderer.render(scene,camera);
}
animate();
