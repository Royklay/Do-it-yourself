// Import Three.js
import * as THREE from "three";
// Import tools for loading and controlling the 3D model
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Get the HTML element where the engine will appear
const viewer = document.getElementById("engine-viewer");
// Create the 3D scene
const scene = new THREE.Scene();