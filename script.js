const canvas=document.getElementById("stars");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let stars=[];
let speedFactor=1;

window.addEventListener("scroll",()=>{
speedFactor=1+window.scrollY/300;
});

window.addEventListener("mousemove",(e)=>{
stars.forEach(star=>{
star.x+= (e.clientX-canvas.width/2)/500*star.depth;
star.y+= (e.clientY-canvas.height/2)/500*star.depth;
});
});

for(let i=0;i<200;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
radius:Math.random()*2,
speed:Math.random()*0.5,
depth:Math.random()*2
});
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);

stars.forEach(star=>{
ctx.beginPath();
ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
ctx.fillStyle="white";
ctx.fill();

star.y+=star.speed*speedFactor;

if(star.y>canvas.height){
star.y=0;
star.x=Math.random()*canvas.width;
}
});

requestAnimationFrame(draw);
}

draw();

/* METEOR */
function meteor(){
let x=Math.random()*canvas.width;
let y=0;
let len=80;
let speed=8;

function animate(){
ctx.beginPath();
ctx.moveTo(x,y);
ctx.lineTo(x-len,y+len);
ctx.strokeStyle="white";
ctx.lineWidth=2;
ctx.stroke();
x+=speed;
y+=speed;
if(y<canvas.height)requestAnimationFrame(animate);
}
animate();
}

setInterval(meteor,4000);
