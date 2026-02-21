// SAHNE
const scene = new THREE.Scene();

// KAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.z = 120;

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

// IŞIK
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(200, 200, 200);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// 🌍 GERÇEKÇİ DÜNYA (Shader ile)
const earthGeometry = new THREE.SphereGeometry(30, 128, 128);

const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { value: light.position }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position,1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            float intensity = dot(vNormal, normalize(vec3(0.5,0.2,1.0)));

            vec3 dayColor = vec3(0.0, 0.3, 0.8);
            vec3 nightColor = vec3(0.0, 0.0, 0.2);

            vec3 color = mix(nightColor, dayColor, intensity);

            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// ⭐ YILDIZLAR
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 4000; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.6
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ANİMASYON
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.003;

    renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
