const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let mouse = { x: canvas.width/2, y: canvas.height/2 };

window.addEventListener("mousemove", (e)=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/////////////////////////////////////////////////
// 🌍 DÜNYA
/////////////////////////////////////////////////

let earth = {
  x: canvas.width/2,
  y: canvas.height/2,
  radius: 250,
  angle: 0
};

function drawEarth(){
  earth.angle += 0.002;

  let gradient = ctx.createRadialGradient(
    earth.x - 80,
    earth.y - 80,
    50,
    earth.x,
    earth.y,
    earth.radius
  );

  gradient.addColorStop(0,"#3fa9f5");
  gradient.addColorStop(0.4,"#1e5799");
  gradient.addColorStop(1,"#0b1e3d");

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI*2);
  ctx.fill();
}

/////////////////////////////////////////////////
// ⭐ YILDIZ
/////////////////////////////////////////////////

class Star{
  constructor(){
    this.reset();
  }

  reset(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.size = Math.random()*2;
    this.depth = Math.random()*0.8+0.2;
  }

  update(){
    let dx = (mouse.x - canvas.width/2)*0.0008*this.depth;
    let dy = (mouse.y - canvas.height/2)*0.0008*this.depth;

    this.x += dx;
    this.y += dy;

    if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height){
      this.reset();
    }
  }

  draw(){
    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
}

let stars=[];
for(let i=0;i<400;i++){
  stars.push(new Star());
}

/////////////////////////////////////////////////
// ☄️ METEOR
/////////////////////////////////////////////////

class Meteor{
  constructor(){
    this.reset();
  }

  reset(){
    this.x = Math.random()*canvas.width;
    this.y = -100;
    this.angle = Math.random()*Math.PI/2;
    this.speed = Math.random()*6+7;
    this.length = Math.random()*200+150;
    this.opacity = 1;
  }

  update(){
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed;
    this.opacity -= 0.005;

    if(this.opacity<=0||this.y>canvas.height+200){
      this.reset();
    }
  }

  draw(){
    ctx.save();
    ctx.globalAlpha = this.opacity;

    let tailX = this.x - Math.cos(this.angle)*this.length;
    let tailY = this.y - Math.sin(this.angle)*this.length;

    let gradient = ctx.createLinearGradient(this.x,this.y,tailX,tailY);
    gradient.addColorStop(0,"white");
    gradient.addColorStop(0.3,"#ffd27f");
    gradient.addColorStop(0.6,"#ff5e00");
    gradient.addColorStop(1,"transparent");

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(tailX,tailY);
    ctx.stroke();

    ctx.restore();
  }
}

let meteors=[];
for(let i=0;i<4;i++){
  meteors.push(new Meteor());
}

/////////////////////////////////////////////////
// 🎬 ANIMATION
/////////////////////////////////////////////////

function animate(){
  ctx.fillStyle="rgba(0,0,20,0.8)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  drawEarth();

  stars.forEach(s=>{
    s.update();
    s.draw();
  });

  meteors.forEach(m=>{
    m.update();
    m.draw();
  });

  requestAnimationFrame(animate);
}

animate();
