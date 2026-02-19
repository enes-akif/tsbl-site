/* COUNTDOWN */
const targetDate=new Date("February 23, 2026 12:00:00").getTime();

setInterval(()=>{
const now=new Date().getTime();
const distance=targetDate-now;

const d=Math.floor(distance/(1000*60*60*24));
const h=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
const m=Math.floor((distance%(1000*60*60))/(1000*60));
const s=Math.floor((distance%(1000*60))/1000);

document.getElementById("days").innerHTML=d;
document.getElementById("hours").innerHTML=h;
document.getElementById("minutes").innerHTML=m;
document.getElementById("seconds").innerHTML=s;

},1000);

/* THREE JS SCENE */
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

/* STARS */
const starGeometry=new THREE.BufferGeometry();
const starVertices=[];
for(let i=0;i<1000;i++){
starVertices.push(
THREE.MathUtils.randFloatSpread(2000),
THREE.MathUtils.randFloatSpread(2000),
THREE.MathUtils.randFloatSpread(2000)
);
}
starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3));
const starMaterial=new THREE.PointsMaterial({color:0xffffff});
const stars=new THREE.Points(starGeometry,starMaterial);
scene.add(stars);

/* 3D METEOR */
const meteorGeometry=new THREE.SphereGeometry(1,32,32);
const meteorMaterial=new THREE.MeshStandardMaterial({color:0xff5500,emissive:0xff2200});
const meteor=new THREE.Mesh(meteorGeometry,meteorMaterial);
scene.add(meteor);

meteor.position.set(-50,30,-50);

/* LIGHT */
const light=new THREE.PointLight(0xffffff,2);
light.position.set(10,10,10);
scene.add(light);

camera.position.z=50;

function animate(){
requestAnimationFrame(animate);

/* Meteor movement */
meteor.position.x+=0.5;
meteor.position.y-=0.3;
meteor.rotation.x+=0.1;

if(meteor.position.y<-30){
meteor.position.set(-50,30,-50);
}

renderer.render(scene,camera);
}

animate();
