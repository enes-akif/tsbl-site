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


// CANVAS
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let mouse = {x: null, y: null};

window.addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

for(let i=0;i<200;i++){
    stars.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        radius:Math.random()*2,
        speed:Math.random()*0.5,
        depth:Math.random()*3
    });
}

function drawStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    stars.forEach(star=>{
        let dx = mouse.x ? (mouse.x - canvas.width/2)/500 : 0;
        let dy = mouse.y ? (mouse.y - canvas.height/2)/500 : 0;

        ctx.beginPath();
        ctx.arc(star.x + dx*star.depth, star.y + dy*star.depth, star.radius, 0, Math.PI*2);
        ctx.fillStyle="white";
        ctx.fill();

        star.y += star.speed;

        if(star.y > canvas.height){
            star.y = 0;
            star.x = Math.random()*canvas.width;
        }
    });

    requestAnimationFrame(drawStars);
}

drawStars();


// METEOR EFFECT
function createMeteor(){
    let x = Math.random()*canvas.width;
    let y = 0;

    let length = Math.random()*80+50;
    let speed = Math.random()*10+6;

    function meteor(){
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x-length,y+length);
        ctx.strokeStyle="white";
        ctx.lineWidth=2;
        ctx.stroke();

        x += speed;
        y += speed;

        if(y < canvas.height){
            requestAnimationFrame(meteor);
        }
    }

    meteor();
}

setInterval(createMeteor, 4000);
