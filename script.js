const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for(let i=0;i<300;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
radius:Math.random()*1.5
});
}

function drawStars(){
ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";
stars.forEach(star=>{
ctx.beginPath();
ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
ctx.fill();
});
}

/* METEOR */
let meteor = {
x:Math.random()*canvas.width,
y:-100,
length:120,
speed:8
};

function drawMeteor(){
ctx.strokeStyle="orange";
ctx.lineWidth=2;

ctx.beginPath();
ctx.moveTo(meteor.x,meteor.y);
ctx.lineTo(meteor.x-50,meteor.y+meteor.length);
ctx.stroke();

meteor.x += meteor.speed;
meteor.y += meteor.speed;

if(meteor.y > canvas.height){
meteor.x = Math.random()*canvas.width;
meteor.y = -100;
}
}

function animate(){
drawStars();
drawMeteor();
requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize",()=>{
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});