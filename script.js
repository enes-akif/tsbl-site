const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("earth-container").appendChild(renderer.domElement);

/* DÜNYA */
const geometry = new THREE.SphereGeometry(4,128,128);
const material = new THREE.MeshStandardMaterial({
color:0x2266ff,
roughness:0.7,
metalness:0.1
});
const earth = new THREE.Mesh(geometry,material);
scene.add(earth);

/* IŞIK */
const ambient = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff,1);
directional.position.set(5,3,5);
scene.add(directional);

camera.position.z=10;

/* METEOR */
let meteor;

function spawnMeteor(){

if(meteor) scene.remove(meteor);

const meteorGeo = new THREE.SphereGeometry(0.3,32,32);
const meteorMat = new THREE.MeshBasicMaterial({color:0xff5500});
meteor = new THREE.Mesh(meteorGeo,meteorMat);

meteor.position.set(
(Math.random()-0.5)*20,
(Math.random()-0.5)*20,
-20
);

scene.add(meteor);

const target = new THREE.Vector3(
(Math.random()-0.5)*4,
(Math.random()-0.5)*4,
(Math.random()-0.5)*4
);

let progress = 0;

function move(){
progress+=0.01;

meteor.position.lerp(target,progress);

if(progress<1){
requestAnimationFrame(move);
}else{
scene.remove(meteor);
}

}

move();
}

setInterval(spawnMeteor,10000);

/* ANIMATE */
function animate(){
requestAnimationFrame(animate);
earth.rotation.y+=0.002;
renderer.render(scene,camera);
}

animate();

/* RESIZE */
window.addEventListener("resize",()=>{
camera.aspect=window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);
});