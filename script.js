/* COUNTDOWN */
const targetDate=new Date("February 23, 2026 12:00:00").getTime();

setInterval(()=>{
const now=new Date().getTime();
const distance=targetDate-now;

const d=Math.floor(distance/(1000*60*60*24));
const h=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
const m=Math.floor((distance%(1000*60*60))/(1000*60));
const s=Math.floor((distance%(1000*60))/1000);

update("days",d);
update("hours",h);
update("minutes",m);
update("seconds",s);

},1000);

function update(id,val){
const el=document.getElementById(id);
if(el.innerHTML!=val){
el.style.transform="scale(1.3)";
setTimeout(()=>el.style.transform="scale(1)",200);
el.innerHTML=val;
}
}

/* THREE JS EARTH */
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
const renderer=new THREE.WebGLRenderer({alpha:true});
renderer.setSize(450,450);
document.getElementById("earth3d").appendChild(renderer.domElement);

const geometry=new THREE.SphereGeometry(2,64,64);
const texture=new THREE.TextureLoader().load("https://threejsfundamentals.org/threejs/resources/images/earth-day.jpg");
const material=new THREE.MeshStandardMaterial({map:texture});
const earth=new THREE.Mesh(geometry,material);
scene.add(earth);

const light=new THREE.DirectionalLight(0xffffff,1.2);
light.position.set(5,0,5);
scene.add(light);

camera.position.z=5;

function animate(){
requestAnimationFrame(animate);
earth.rotation.y+=0.003;
renderer.render(scene,camera);
}
animate();

/* SCROLL ZOOM EFFECT */
window.addEventListener("scroll",()=>{
let scroll=window.scrollY;
camera.position.z=5-(scroll/600);
});

/* STAR SPEED EFFECT */
const canvas=document.getElementById("stars");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let stars=[];
for(let i=0;i<200;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});
}

function drawStars(){
ctx.clearRect(0,0,canvas.width,canvas.height);
let speed=1+(window.scrollY/300);

stars.forEach(star=>{
star.y+=speed;
if(star.y>canvas.height) star.y=0;

ctx.fillStyle="white";
ctx.fillRect(star.x,star.y,star.size,star.size);
});
requestAnimationFrame(drawStars);
}
drawStars();

/* CINEMA METEOR */
function meteor(){
let x=Math.random()*canvas.width;
let y=0;
let angle=Math.random()*Math.PI/3+Math.PI/6;
let speed=10;

function animateMeteor(){
ctx.beginPath();
ctx.moveTo(x,y);
ctx.lineTo(x-120*Math.cos(angle),y+120*Math.sin(angle));
ctx.strokeStyle="orange";
ctx.lineWidth=4;
ctx.stroke();

x+=speed*Math.cos(angle);
y+=speed*Math.sin(angle);

if(y>canvas.height*0.6){
impact();
return;
}
requestAnimationFrame(animateMeteor);
}
animateMeteor();
}

function impact(){
document.getElementById("flash").style.opacity=0.8;
setTimeout(()=>document.getElementById("flash").style.opacity=0,200);

document.body.style.transform="translateX(5px)";
setTimeout(()=>document.body.style.transform="translateX(-5px)",50);
setTimeout(()=>document.body.style.transform="translateX(0)",100);
}

setInterval(meteor,5000);
