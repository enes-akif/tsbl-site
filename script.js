/* STARS */
const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener("resize",resize);

let stars=[];
for(let i=0;i<700;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});
}

function drawStars(){
ctx.clearRect(0,0,canvas.width,canvas.height);
stars.forEach(star=>{
ctx.beginPath();
ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
ctx.fillStyle="white";
ctx.fill();
});
requestAnimationFrame(drawStars);
}
drawStars();

/* METEOR SYSTEM */
function createMeteor(){
let meteor=document.createElement("div");
meteor.className="meteor";

let startX=Math.random()*window.innerWidth;
let startY=-200;

meteor.style.left=startX+"px";
meteor.style.top=startY+"px";

document.body.appendChild(meteor);

let angle=(Math.random()*60)-30;
let distance=window.innerHeight+400;

meteor.animate([
{transform:`translate(0,0) rotate(${angle}deg)`},
{transform:`translate(${Math.sin(angle*Math.PI/180)*distance}px, ${distance}px) rotate(${angle}deg)`}
],{
duration:2000+Math.random()*1500,
easing:"linear"
});

setTimeout(()=>meteor.remove(),3500);
}

setInterval(createMeteor,1000);

/* DROPDOWN */
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