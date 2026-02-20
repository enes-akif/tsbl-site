const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let stars=[];
for(let i=0;i<400;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});
}

let mouseX=0;
let mouseY=0;
document.addEventListener("mousemove",e=>{
mouseX=e.clientX;
mouseY=e.clientY;
});

function drawStars(){
ctx.clearRect(0,0,canvas.width,canvas.height);
stars.forEach(star=>{
ctx.beginPath();
ctx.arc(star.x+(mouseX-window.innerWidth/2)*0.0005,
star.y+(mouseY-window.innerHeight/2)*0.0005,
star.size,0,Math.PI*2);
ctx.fillStyle="white";
ctx.fill();
});
}

function animateStars(){
drawStars();
requestAnimationFrame(animateStars);
}
animateStars();

/* Meteor */
function createMeteor(){
let meteor=document.createElement("div");
meteor.className="meteor";
meteor.style.left=Math.random()*window.innerWidth+"px";
meteor.style.top="-100px";
meteor.style.transform=`rotate(${Math.random()*360}deg)`;
document.body.appendChild(meteor);

setTimeout(()=>{meteor.remove();},3000);
}
setInterval(createMeteor,2000);

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

/* Countdown */
const targetDate=new Date("2026-02-23T12:00:00").getTime();
const countdown=document.getElementById("countdown");

setInterval(()=>{
const now=new Date().getTime();
const distance=targetDate-now;

const days=Math.floor(distance/(1000*60*60*24));
const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
const minutes=Math.floor((distance%(1000*60*60))/(1000*60));
const seconds=Math.floor((distance%(1000*60))/1000);

countdown.innerHTML=
`${days} Gün ${hours} Saat ${minutes} Dakika ${seconds} Saniye`;
},1000);