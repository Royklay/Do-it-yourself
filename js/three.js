// Import Three.js
import * as THREE from "three";
// Import tools for loading and controlling the 3D model
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Get the HTML element where the engine will appear
const viewer = document.getElementById("engine-viewer");
// Create the 3D scene
const scene = new THREE.Scene();
// Create the camera
const camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    1000
);
// Create the renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Put the 3D renderer inside our HTML viewer
viewer.appendChild(renderer.domElement);

// Add lighting to the engine
const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(5, 8, 5);
scene.add(mainLight);

const blueLight = new THREE.PointLight(0x168cff, 25);
blueLight.position.set(-5, 2, -4);
scene.add(blueLight);

const softLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(softLight);

// Allow the user to rotate and zoom the engine
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Load the engine model
const loader = new GLTFLoader();

// Show a loading message
const loadingMessage = document.createElement("p");
loadingMessage.textContent = "Loading 3D engine...";
loadingMessage.style.position = "absolute";
loadingMessage.style.top = "50%";
loadingMessage.style.left = "50%";
loadingMessage.style.transform = "translate(-50%, -50%)";
loadingMessage.style.color = "white";
loadingMessage.style.zIndex = "2";
viewer.style.position = "relative";
viewer.appendChild(loadingMessage);

loader.load(
    "models/engine.glb",

    function (gltf) {
// Get the engine model from the GLB file
        const engine = gltf.scene;
// Add the engine to the 3D scene
        scene.add(engine);
// Find the size and centre of the engine
        const box = new THREE.Box3().setFromObject(engine);
        const center = box.getCenter(new THREE.Vector3());
        const sphere = box.getBoundingSphere(new THREE.Sphere());
// Move the engine to the centre of the scene
        engine.position.sub(center);
 // Position the camera so the whole engine is visible
        const distance = sphere.radius / Math.sin(
            THREE.MathUtils.degToRad(camera.fov / 2)
        );

        camera.position.set(
            distance * 1.5,
            distance * 0.8,
            distance * 1.5
        );

        camera.near = Math.max(0.01, sphere.radius / 100);
        camera.far = distance * 10;
        camera.updateProjectionMatrix();
 // Set the rotation and zoom target
        controls.target.set(0, 0, 0);
        controls.minDistance = sphere.radius * 0.8;
        controls.maxDistance = distance * 4;
        controls.update();
  // Find the separate parts of the engine
        console.log("Engine parts:");

        engine.traverse(function (part) {

            if (part.isMesh) {

                console.log(part.name);

                part.castShadow = true;
                part.receiveShadow = true;

            }

        });
   // Remove the loading message
        loadingMessage.remove();

        console.log("Engine loaded successfully!");

    },

    undefined,

    function (error) {

        loadingMessage.textContent =
            "Could not load the engine. Check the model file path.";

        console.error("Error loading engine:", error);

    }
);

// Rotate button
let isRotating = false;

document.getElementById("rotateBtn").addEventListener("click", function () {

    isRotating = !isRotating;
    controls.autoRotate = isRotating;

});
