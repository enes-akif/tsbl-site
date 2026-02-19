const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(
75,
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

const light=new THREE.PointLight(0xffffff,1.5);
light.position.set(5,3,5);
scene.add(light);

const ambient=new THREE.AmbientLight(0x404040);
scene.add(ambient);

const geometry=new THREE.SphereGeometry(2.5,64,64);
const textureLoader=new THREE.TextureLoader();
const earthTexture=textureLoader.load("images/earth.jpg");

const material=new THREE.MeshStandardMaterial({
map:earthTexture
});

const earth=new THREE.Mesh(geometry,material);
scene.add(earth);

camera.position.z=7;

let mouseX=0;
let mouseY=0;

document.addEventListener("mousemove",(e)=>{
mouseX=(e.clientX/window.innerWidth-0.5)*2;
mouseY=(e.clientY/window.innerHeight-0.5)*2;
});

function animateEarth(){
requestAnimationFrame(animateEarth);

earth.rotation.y+=0.002;
earth.rotation.x=mouseY*0.3;
earth.rotation.y+=mouseX*0.001;

renderer.render(scene,camera);
}

animateEarth();

window.addEventListener("resize",()=>{
camera.aspect=window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);
});
