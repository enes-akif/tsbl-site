const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let stars=[];
let meteors=[];

class Star{
constructor(){
this.x=Math.random()*canvas.width;
this.y=Math.random()*canvas.height;
this.size=Math.random()*2;
this.speed=Math.random()*0.5;
}
update(){
this.y+=this.speed;
if(this.y>canvas.height){
this.y=0;
this.x=Math.random()*canvas.width;
}
}
draw(){
ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
ctx.fill();
}
}

class Meteor{
constructor(){
this.x=Math.random()*canvas.width;
this.y=0;
this.angle=Math.random()*Math.PI*2;
this.speed=4+Math.random()*5;
this.length=100;
}
update(){
this.x+=Math.cos(this.angle)*this.speed;
this.y+=Math.sin(this.angle)*this.speed;
}
draw(){
const tailX=this.x-Math.cos(this.angle)*this.length;
const tailY=this.y-Math.sin(this.angle)*this.length;

const g=ctx.createLinearGradient(this.x,this.y,tailX,tailY);
g.addColorStop(0,"white");
g.addColorStop(0.3,"yellow");
g.addColorStop(1,"red");

ctx.strokeStyle=g;
ctx.lineWidth=3;
ctx.beginPath();
ctx.moveTo(this.x,this.y);
ctx.lineTo(tailX,tailY);
ctx.stroke();
}
}

for(let i=0;i<400;i++){
stars.push(new Star());
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);

stars.forEach(s=>{s.update();s.draw();});

if(Math.random()<0.03){
meteors.push(new Meteor());
}

meteors.forEach((m,i)=>{
m.update();
m.draw();
if(m.x<0||m.x>canvas.width||m.y<0||m.y>canvas.height){
meteors.splice(i,1);
}
});

requestAnimationFrame(animate);
}

animate();

/* Sayaç */
function countdown(){
const target=new Date("Feb 23, 2026 12:00:00").getTime();
const now=new Date().getTime();
const diff=target-now;

const d=Math.floor(diff/(1000*60*60*24));
const h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
const m=Math.floor((diff%(1000*60*60))/(1000*60));
const s=Math.floor((diff%(1000*60))/1000);

document.getElementById("countdown").innerHTML=
`${d} Gün ${h} Saat ${m} Dakika ${s} Saniye`;
}
setInterval(countdown,1000);
