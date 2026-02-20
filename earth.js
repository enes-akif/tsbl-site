const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.getElementById("earth-container").appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(2.5,64,64);
const texture = new THREE.TextureLoader().load("assets/earthmap.jpg");
const material = new THREE.MeshStandardMaterial({map:texture});
const earth = new THREE.Mesh(geometry,material);
scene.add(earth);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,3,5);
scene.add(light);

camera.position.z=10;

function animate(){
requestAnimationFrame(animate);
earth.rotation.y+=0.002;
renderer.render(scene,camera);
}
animate();