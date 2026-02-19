// COUNTDOWN
const targetDate = new Date("Feb 23, 2026 12:45:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    document.getElementById("days").innerHTML = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("hours").innerHTML = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    document.getElementById("minutes").innerHTML = Math.floor((distance % (1000*60*60)) / (1000*60));
    document.getElementById("seconds").innerHTML = Math.floor((distance % (1000*60)) / 1000);
}, 1000);


// STAR EFFECT
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for(let i=0;i<150;i++){
    stars.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        radius:Math.random()*2,
        dx:(Math.random()-0.5)*0.5,
        dy:(Math.random()-0.5)*0.5
    });
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";

    stars.forEach(star=>{
        ctx.beginPath();
        ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
        ctx.fill();

        star.x+=star.dx;
        star.y+=star.dy;

        if(star.x<0||star.x>canvas.width) star.dx*=-1;
        if(star.y<0||star.y>canvas.height) star.dy*=-1;
    });

    requestAnimationFrame(animate);
}

animate();
