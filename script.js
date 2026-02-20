const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

/* STARS */
let stars=[];
for(let i=0;i<600;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});
}

let mouseX=0, mouseY=0;
document.addEventListener("mousemove",e=>{
mouseX=e.clientX;
mouseY=e.clientY;
});

function drawStars(){
ctx.clearRect(0,0,canvas.width,canvas.height);
stars.forEach(star=>{
ctx.beginPath();
ctx.arc(
star.x+(mouseX-window.innerWidth/2)*0.0007,
star.y+(mouseY-window.innerHeight/2)*0.0007,
star.size,0,Math.PI*2);
ctx.fillStyle="white";
ctx.fill();
});
requestAnimationFrame(drawStars);
}
drawStars();

/* METEOR */
function createMeteor(){
let meteor=document.createElement("div");
meteor.className="meteor";

let startX=Math.random()*window.innerWidth;
let randomX=(Math.random()-0.5)*600;

meteor.style.left=startX+"px";
meteor.style.setProperty("--x",randomX+"px");
meteor.style.animationDuration=(Math.random()*2+2)+"s";

document.body.appendChild(meteor);

setTimeout(()=>meteor.remove(),4000);
}
setInterval(createMeteor,1500);

/* Dropdown */
document.querySelectorAll(".dropbtn").forEach(btn=>{
btn.addEventListener("click",function(e){
e.stopPropagation();
this.nextElementSibling.classList.toggle("show");
});
});
window.addEventListener("click",()=>{
document.querySelectorAll(".dropdown-content").forEach(menu=>{
menu.classList.remove("show");
});
});

/* COUNTDOWN */
const targetDate=new Date("2026-02-23T12:00:00").getTime();
const countdown=document.getElementById("countdown");

setInterval(()=>{
const now=new Date().getTime();
const distance=targetDate-now;

const d=Math.floor(distance/(1000*60*60*24));
const h=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
const m=Math.floor((distance%(1000*60*60))/(1000*60));
const s=Math.floor((distance%(1000*60))/1000);

countdown.innerHTML=`${d} Gün ${h} Saat ${m} Dakika ${s} Saniye`;
},1000);