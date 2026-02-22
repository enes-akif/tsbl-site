/* =========================
   STARS
========================= */

const starContainer = document.getElementById("star-background");

function createStars() {
    const starCount = 450;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 1 + 0.3;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";

        starContainer.appendChild(star);
    }
}
createStars();


/* =========================
   THREE SETUP
========================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(500, 500);
document.getElementById("earth-container").appendChild(renderer.domElement);

camera.position.z = 5;

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);


/* =========================
   EARTH
========================= */

const loader = new THREE.TextureLoader();
const earthTexture = loader.load("earth.jpg");

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture })
);

scene.add(earth);


/* =========================
   METEOR SYSTEM
========================= */

let meteors = [];

function createFlameShader() {

    return new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec3 pos = position;
                pos.z += sin(uv.y * 10.0 + time * 5.0) * 0.05;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {

                float intensity = 1.0 - vUv.y;

                vec3 color = mix(
                    vec3(1.0,0.1,0.0),
                    vec3(1.0,0.8,0.0),
                    intensity
                );

                float alpha = intensity * 0.8;

                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}


function spawnMeteor() {

    const meteorTexture = loader.load("meteor.jpg");

    const geometry = new THREE.IcosahedronGeometry(
        0.1 + Math.random() * 0.05,
        1
    );

    const material = new THREE.MeshStandardMaterial({
        map: meteorTexture,
        roughness: 1,
        metalness: 0.2
    });

    const meteor = new THREE.Mesh(geometry, material);

    const directionVector = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    ).normalize();

    meteor.position.copy(directionVector.multiplyScalar(30));

    const direction = new THREE.Vector3()
        .subVectors(earth.position, meteor.position)
        .normalize();

    // 🔥 Gerçekçi Alev Konisi
    const flameGeometry = new THREE.ConeGeometry(0.15, 0.6, 32);
    const flameMaterial = createFlameShader();
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);

    flame.rotation.x = Math.PI;
    flame.position.z = -0.3;

    meteor.add(flame);

    scene.add(meteor);

    meteors.push({
        mesh: meteor,
        direction: direction,
        speed: 0.04 + Math.random() * 0.02,
        flame: flame,
        flameMaterial: flameMaterial
    });
}


setInterval(() => {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
        setTimeout(spawnMeteor, i * 1000);
    }
}, 15000);


/* =========================
   EXPLOSION
========================= */

function createExplosion(position) {

    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 1
    });

    const explosion = new THREE.Mesh(geometry, material);
    explosion.position.copy(position);
    scene.add(explosion);

    let scale = 0.3;

    const explode = setInterval(() => {
        scale += 0.4;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity -= 0.03;

        if (explosion.material.opacity <= 0) {
            scene.remove(explosion);
            clearInterval(explode);
        }
    }, 30);
}


/* =========================
   ANIMATION
========================= */

function animate(time) {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    meteors.forEach((m, index) => {

        m.mesh.position.add(
            m.direction.clone().multiplyScalar(m.speed)
        );

        m.mesh.rotation.x += 0.05;
        m.mesh.rotation.y += 0.05;

        // 🔥 Alev animasyonu
        m.flameMaterial.uniforms.time.value = time * 0.001;

        // Atmosfer güçlenmesi
        if (m.mesh.position.length() < 6) {
            m.flame.scale.set(1.4, 1.4, 1.4);
        }

        if (m.mesh.position.length() < 1.5) {

            createExplosion(m.mesh.position.clone());

            scene.remove(m.mesh);
            meteors.splice(index, 1);
        }

    });

    renderer.render(scene, camera);
}

animate();