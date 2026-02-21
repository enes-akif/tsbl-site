/* 3D WORLD */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(500,500);
document.getElementById("earth-container").appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("earth.jpg");

const geometry = new THREE.SphereGeometry(1,64,64);

const material = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(geometry,material);
scene.add(earth);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,3,5);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff,0.4);
scene.add(ambient);

camera.position.z = 3;

function animate(){
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    renderer.render(scene,camera);
}

animate();

/* DROPDOWN CLICK FIX */

document.querySelectorAll(".dropbtn").forEach(button=>{
    button.addEventListener("click", function(e){
        e.stopPropagation();

        const menu = this.nextElementSibling;

        document.querySelectorAll(".dropdown-content").forEach(d=>{
            if(d !== menu){
                d.style.display="none";
            }
        });

        menu.style.display =
            menu.style.display === "flex" ? "none" : "flex";
    });
});

document.addEventListener("click", function(){
    document.querySelectorAll(".dropdown-content").forEach(d=>{
        d.style.display="none";
    });
});