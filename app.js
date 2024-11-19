import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Gradient Shader Material (Gradient-Material mit Shader)
const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color1: { value: new THREE.Color(0x8e44ad) }, // Dunkles Lila
        color2: { value: new THREE.Color(0xdcc6e0) }, // Helles Lila
    },
    vertexShader: `
        varying vec3 vPosition;
        void main() {
            vPosition = position; // Übergeben der Vertex-Position an den Fragment-Shader
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        void main() {
            float mixRatio = (vPosition.y + 1.0) / 2.0; // Normalisieren der Y-Koordinate auf den Bereich [0, 1]
            gl_FragColor = vec4(mix(color1, color2, mixRatio), 1.0);
        }
    `,
});

// Geometrien hinzufügen
const cubeGeometry = new THREE.BoxGeometry(); // Würfel-Geometrie erstellen
const cube = new THREE.Mesh(cubeGeometry, gradientMaterial); // Mesh mit Gradient-Material erstellen
scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(10, 10); // Ebene erstellen
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide }); // Einfaches Material für die Ebene
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // Ebene in die XZ-Ebene drehen
scene.add(plane);

function animate() {
    requestAnimationFrame(animate); // Animationsschleife
    renderer.render(scene, camera); // Szene rendern
}
animate();

// Funktion zum Erstellen einer rekursiven Kugel
function createRecursiveSphere(radius, depth) {
    const geometry = new THREE.OctahedronGeometry(radius, depth); // Oktader-Geometrie mit Rekursionstiefe
    const material = new THREE.MeshBasicMaterial({
        color: 0x90caef,
        wireframe: true, // Drahtgittermodus aktivieren
    });
    return new THREE.Mesh(geometry, material); // Mesh zurückgeben
}

let sphere = createRecursiveSphere(1, 0); // Anfangskugel mit Rekursionstiefe 0
scene.add(sphere);

// Steuerung für Rekursionstiefe hinzufügen
const depthControl = document.createElement('div');
depthControl.innerHTML = `
    <button id="increase">+</button>
    <button id="decrease">-</button>
`;
document.body.appendChild(depthControl);

let recursionDepth = 0;

// Ereignislistener für die Schaltflächen
document.getElementById('increase').addEventListener('click', () => {
    recursionDepth = Math.min(recursionDepth + 1, 10); // Maximale Rekursionstiefe auf 10 begrenzen
    scene.remove(sphere); // Alte Kugel entfernen
    sphere = createRecursiveSphere(1, recursionDepth); // Neue Kugel mit erhöhter Tiefe erstellen
    scene.add(sphere); // Neue Kugel zur Szene hinzufügen
});

document.getElementById('decrease').addEventListener('click', () => {
    recursionDepth = Math.max(recursionDepth - 1, 0); // Minimale Rekursionstiefe auf 0 begrenzen
    scene.remove(sphere); // Alte Kugel entfernen
    sphere = createRecursiveSphere(1, recursionDepth); // Neue Kugel mit verringerter Tiefe erstellen
    scene.add(sphere); // Neue Kugel zur Szene hinzufügen
});

let angle = 0;
let radius = 5;

// Ereignislistener für die Tastatursteuerung
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') angle -= 0.1; // Kamera nach links bewegen
    if (event.key === 'ArrowRight') angle += 0.1; // Kamera nach rechts bewegen
    if (event.key === 'n') radius = Math.max(radius - 0.1, 1); // Radius verkleinern, Mindestwert: 1
    if (event.key === 'N') radius = Math.min(radius + 0.1, 10); // Radius vergrößern, Maximalwert: 10

    camera.position.x = radius * Math.sin(angle); // Kamera auf der X-Achse bewegen
    camera.position.z = radius * Math.cos(angle); // Kamera auf der Z-Achse bewegen
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Kamera auf den Ursprung richten
});
