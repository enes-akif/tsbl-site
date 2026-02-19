const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer=new THREE.WebGLRenderer({
alpha:true,
antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.domElement.style.position="fixed";
renderer.domElement.style.top="0";
renderer.domElement.style.left="0";
renderer.domElement.style.zIndex="-2";
document.body.appendChild(renderer.domElement);

const light=new THREE.PointLight(0xffffff,2);
light.position.set(10,5,10);
scene.add(light);

const ambient=new THREE.AmbientLight(0x404040,2);
scene.add(ambient);

const geometry=new THREE.SphereGeometry(3,128,128);

const textureLoader=new THREE.TextureLoader();
const earthTexture=textureLoader.load("images/earth.jpg");

const material=new THREE.MeshStandardMaterial({
map:earthTexture
});

const earth=new THREE.Mesh(geometry,material);
scene.add(earth);

camera.position.z=10;

function animateEarth(){
requestAnimationFrame(animateEarth);
earth.rotation.y+=0.002;
renderer.render(scene,camera);
}
animateEarth();
