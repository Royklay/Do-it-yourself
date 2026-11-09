import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Get the HTML viewer
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

viewer.appendChild(renderer.domElement);

// Add lights
const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(5, 8, 5);
scene.add(mainLight);

const blueLight = new THREE.PointLight(0x168cff, 25);
blueLight.position.set(-5, 2, -4);
scene.add(blueLight);

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// Allow mouse rotation and zooming
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Variables for the engine and glowing marker
let engine = null;
let selectedMarker = null;
let markerParts = {};

// Our four engine problems
const problems = {

    overheating: {
        keywords: ["overheating", "hot", "temperature", "coolant", "radiator"],

        title: "Engine Overheating",

        causes: "Low coolant, a coolant leak or a faulty cooling fan.",

        steps: "1. Switch off the engine and let it cool completely. 2. Check the coolant level in the reservoir. 3. Look for visible leaks. 4. If it keeps overheating, visit a mechanic. Never open a hot radiator cap.",

        marker: "cooling"
    },

    battery: {
        keywords: ["battery", "charging", "alternator", "charge", "battery light"],

        title: "Battery Not Charging",

        causes: "A faulty alternator, loose wiring or a damaged alternator belt.",

        steps: "1. Switch off the engine. 2. Check for visibly loose or damaged battery connections. 3. Look for a damaged or loose alternator belt without touching moving parts. 4. Have the charging system tested if the problem continues.",

        marker: "alternator"
    },

    misfire: {
        keywords: ["misfire", "misfiring", "shaking", "rough idle", "spark plug", "spark plugs"],

        title: "Engine Misfiring",

        causes: "Worn spark plugs, a loose ignition coil connection or an ignition problem.",

        steps: "1. Switch off the engine and let it cool. 2. Look for visibly loose ignition coil connectors. 3. Check for damaged ignition wires if accessible. 4. Ask a mechanic to inspect the spark plugs if the engine continues shaking.",

        marker: "spark"
    },

    starting: {
        keywords: ["won't start", "wont start", "not starting", "no start", "starter", "clicking", "starting problem"],

        title: "Engine Won't Start",

        causes: "A weak battery, loose battery connections or a faulty starter motor.",

        steps: "1. Check whether the dashboard lights come on. 2. With the engine off, look for loose battery connections. 3. Make sure the vehicle is in Park or Neutral. 4. If it still won't start, have the starter and battery tested.",

        marker: "starter"
    }

};

// Create the glowing marker
function createMarker(color, radius) {

    const marker = new THREE.Group();

    // Glowing centre
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 24),
        new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 3
        })
    );

    marker.add(sphere);

    // Glowing ring around the centre
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 1.8, radius * 0.12, 8, 32),
        new THREE.MeshBasicMaterial({
            color: color
        })
    );

    marker.add(ring);

    // Add light around the marker
    const glow = new THREE.PointLight(color, 2, radius * 12);
    marker.add(glow);

    marker.visible = false;

    return marker;
}

// Load the engine model
const loader = new GLTFLoader();

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

        engine = gltf.scene;

        scene.add(engine);

        // Find the engine's size and centre
        const box = new THREE.Box3().setFromObject(engine);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const sphere = box.getBoundingSphere(new THREE.Sphere());

        // Centre the engine
        engine.position.sub(center);

        // Position the camera
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

        controls.target.set(0, 0, 0);
        controls.minDistance = sphere.radius * 0.8;
        controls.maxDistance = distance * 4;
        controls.update();

        // Discover the engine's objects
        engine.traverse(function (part) {

            if (part.isMesh) {
                console.log("Engine part:", part.name);
            }

        });

        // Create approximate marker positions
        const markerRadius = sphere.radius * 0.035;

        markerParts.cooling = createMarker(0x168cff, markerRadius);
        markerParts.alternator = createMarker(0xffcc33, markerRadius);
        markerParts.spark = createMarker(0xff3333, markerRadius);
        markerParts.starter = createMarker(0x33ff99, markerRadius);

        // Position markers relative to the engine's size
        markerParts.cooling.position.set(
            size.x * 0.30,
            size.y * 0.05,
            size.z * 0.48
        );

        markerParts.alternator.position.set(
            size.x * 0.30,
            -size.y * 0.30,
            size.z * 0.48
        );

        markerParts.spark.position.set(
            0,
            size.y * 0.43,
            size.z * 0.15
        );

        markerParts.starter.position.set(
            -size.x * 0.30,
            -size.y * 0.30,
            size.z * 0.35
        );

        // Attach markers to the engine
        for (const key in markerParts) {
            engine.add(markerParts[key]);
        }

        loadingMessage.remove();

        console.log("Engine loaded successfully!");

        // Show a marker if a problem was searched before loading finished
        if (selectedMarker) {
            markerParts[selectedMarker].visible = true;
        }

    },

    undefined,

    function (error) {

        loadingMessage.textContent = "Could not load the engine.";

        console.error("Engine loading error:", error);

    }

);

// Search for an engine problem
const problemSearch = document.getElementById("problemSearch");
const searchButton = document.getElementById("searchProblem");

const problemCause = document.getElementById("problemCause");
const problemSteps = document.getElementById("problemSteps");

searchButton.addEventListener("click", function () {

    const searchValue = problemSearch.value.toLowerCase().trim();

    // Hide the previous marker
    for (const key in markerParts) {
        markerParts[key].visible = false;
    }

    selectedMarker = null;

    // Find a matching problem
    let foundProblem = null;

    for (const key in problems) {

        const problem = problems[key];

        const matches = problem.keywords.some(function (word) {
            return searchValue.includes(word);
        });

        if (matches) {
            foundProblem = problem;
            break;
        }

    }

    // Display the result
    if (foundProblem) {

        problemCause.textContent =
            foundProblem.title + ": " + foundProblem.causes;

        problemSteps.textContent = foundProblem.steps;

        selectedMarker = foundProblem.marker;

        // Show the matching marker
        if (markerParts[selectedMarker]) {
            markerParts[selectedMarker].visible = true;
        }

    } else {

        problemCause.textContent =
            "Problem not recognised. Try overheating, battery not charging, misfiring or engine won't start.";

        problemSteps.textContent =
            "Please describe one of the four supported engine problems.";

    }

});

// Allow Enter to search
problemSearch.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchButton.click();
    }

});

// Rotate button
let isRotating = false;

document.getElementById("rotateBtn").addEventListener("click", function () {

    isRotating = !isRotating;
    controls.autoRotate = isRotating;

});

// Zoom in
document.getElementById("zoomInBtn").addEventListener("click", function () {

    camera.position.multiplyScalar(0.8);
    controls.update();

});

// Zoom out
document.getElementById("zoomOutBtn").addEventListener("click", function () {

    camera.position.multiplyScalar(1.2);
    controls.update();

});

// Adjust the viewer when the window changes size
window.addEventListener("resize", function () {

    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(viewer.clientWidth, viewer.clientHeight);

});

// Animate the scene
function animate() {

    requestAnimationFrame(animate);

    // Make the selected marker gently pulse
    if (selectedMarker && markerParts[selectedMarker]) {

        const marker = markerParts[selectedMarker];

        const pulse = 1 + Math.sin(Date.now() * 0.006) * 0.15;

        marker.scale.set(pulse, pulse, pulse);

    }

    controls.update();
    renderer.render(scene, camera);

}

animate();