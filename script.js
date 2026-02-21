/* YILDIZLAR */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for(let i=0;i<600;i++){
    stars.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*1.5,
        speed:Math.random()*0.3
    });
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e)=>{
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    stars.forEach(star=>{
        star.x += star.speed + (mouseX - canvas.width/2)*0.00001;
        star.y += star.speed + (mouseY - canvas.height/2)*0.00001;

        if(star.x > canvas.width) star.x = 0;
        if(star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
        ctx.fillStyle="white";
        ctx.fill();
    });

    requestAnimationFrame(animateStars);
}

animateStars();


/* 3D DÜNYA */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,1,0.1,1000);
const renderer = new THREE.WebGLRenderer({alpha:true});

renderer.setSize(400,400);
document.getElementById("earth-container").appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(2,64,64);

const texture = new THREE.TextureLoader().load("earth.jpg");

const material = new THREE.MeshStandardMaterial({map:texture});

const earth = new THREE.Mesh(geometry,material);
scene.add(earth);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,3,5);
scene.add(light);

camera.position.z = 5;

function animateEarth(){
    requestAnimationFrame(animateEarth);
    earth.rotation.y += 0.002;
    renderer.render(scene,camera);
}

animateEarth();