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
document.getElementById("space").appendChild(renderer.domElement);

/* IŞIKLAR */
const ambient = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff,1.2);
light.position.set(5,3,5);
scene.add(light);

/* DÜNYA */
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("earth.jpg");

const earthGeo = new THREE.SphereGeometry(4,128,128);
const earthMat = new THREE.MeshStandardMaterial({
map:earthTexture
});
const earth = new THREE.Mesh(earthGeo,earthMat);
scene.add(earth);

camera.position.z = 12;

/* GERÇEKÇİ YILDIZ ALANI */
const starCount = 2000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for(let i=0;i<starCount;i++){
starPositions.push(
( Math.random()-0.5 ) * 400,
( Math.random()-0.5 ) * 400,
( Math.random()-0.5 ) * 400
);
}

starGeometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(starPositions,3)
);

const starMaterial = new THREE.PointsMaterial({
color:0xffffff,
size:0.3,
sizeAttenuation:true
});

const stars = new THREE.Points(starGeometry,starMaterial);
scene.add(stars);

/* METEOR SİSTEMİ */
function spawnMeteor(){

// Meteor çekirdeği
const meteorGeo = new THREE.SphereGeometry(0.25,32,32);
const meteorMat = new THREE.MeshBasicMaterial({color:0xffaa00});
const meteor = new THREE.Mesh(meteorGeo,meteorMat);

// Rastgele başlangıç noktası
meteor.position.set(
(Math.random()-0.5)*80,
(Math.random()-0.5)*80,
-80
);

scene.add(meteor);

// Kuyruk
const tailGeometry = new THREE.BufferGeometry();
const tailPositions = new Float32Array(300);
tailGeometry.setAttribute('position',new THREE.BufferAttribute(tailPositions,3));

const tailMaterial = new THREE.LineBasicMaterial({
color:0xff3300,
transparent:true,
opacity:0.8
});

const tail = new THREE.Line(tailGeometry,tailMaterial);
scene.add(tail);

// Dünya merkezine doğru hedef
const target = new THREE.Vector3(0,0,0);

let progress = 0;

function moveMeteor(){

progress += 0.015;

meteor.position.lerp(target,progress);

// Kuyruk güncelle
for(let i=tailPositions.length-3;i>=3;i-=3){
tailPositions[i] = tailPositions[i-3];
tailPositions[i+1] = tailPositions[i-2];
tailPositions[i+2] = tailPositions[i-1];
}

tailPositions[0] = meteor.position.x;
tailPositions[1] = meteor.position.y;
tailPositions[2] = meteor.position.z;

tailGeometry.attributes.position.needsUpdate = true;

if(progress < 1){
requestAnimationFrame(moveMeteor);
}else{
createExplosion(meteor.position);
scene.remove(meteor);
scene.remove(tail);
}
}

moveMeteor();
}

/* PATLAMA EFEKTİ */
function createExplosion(position){

const explosionGeo = new THREE.SphereGeometry(0.5,32,32);
const explosionMat = new THREE.MeshBasicMaterial({
color:0xffffaa,
transparent:true
});

const explosion = new THREE.Mesh(explosionGeo,explosionMat);
explosion.position.copy(position);
scene.add(explosion);

let scale = 1;
let opacity = 1;

function animateExplosion(){
scale += 0.2;
opacity -= 0.05;

explosion.scale.set(scale,scale,scale);
explosion.material.opacity = opacity;

if(opacity > 0){
requestAnimationFrame(animateExplosion);
}else{
scene.remove(explosion);
}
}

animateExplosion();
}

/* 10 SANİYEDE BİR METEOR */
setInterval(spawnMeteor,10000);

/* ANİMASYON */
function animate(){
requestAnimationFrame(animate);

earth.rotation.y += 0.002;

renderer.render(scene,camera);
}

animate();

/* RESIZE */
window.addEventListener("resize",()=>{
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);
});
