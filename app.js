import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add geometries
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

function createRecursiveSphere(radius, depth) {
    const geometry = new THREE.OctahedronGeometry(radius, depth);
    const material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true, // Toggle wireframe mode
    });
    return new THREE.Mesh(geometry, material);
}

let sphere = createRecursiveSphere(1, 0);
scene.add(sphere);

const depthControl = document.createElement('div');
depthControl.innerHTML = `
    <button id="increase">+</button>
    <button id="decrease">-</button>
`;
document.body.appendChild(depthControl);

let recursionDepth = 0;

document.getElementById('increase').addEventListener('click', () => {
    recursionDepth = Math.min(recursionDepth + 1, 5); // Limit recursion depth
    scene.remove(sphere);
    sphere = createRecursiveSphere(1, recursionDepth);
    scene.add(sphere);
});

document.getElementById('decrease').addEventListener('click', () => {
    recursionDepth = Math.max(recursionDepth - 1, 0);
    scene.remove(sphere);
    sphere = createRecursiveSphere(1, recursionDepth);
    scene.add(sphere);
});

let angle = 0;
let radius = 5;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') angle -= 0.1;
    if (event.key === 'ArrowRight') angle += 0.1;
    if (event.key === 'n') radius = Math.max(radius - 0.1, 1);
    if (event.key === 'N') radius = Math.min(radius + 0.1, 10);

    camera.position.x = radius * Math.sin(angle);
    camera.position.z = radius * Math.cos(angle);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
});
