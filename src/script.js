import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(600, 200, 50);
scene.add(spotLight);
/**
 * Texture Loader
 */
const environmentMap = new THREE.CubeTextureLoader().load([
	'./skybox2/front.png',
	'./skybox2/back.png',
	'./skybox2/top.png',
	'./skybox2/bottom.png',
	'./skybox2/left.png',
	'./skybox2/right.png',
]);

scene.background = environmentMap;

/**
 * Font Loader
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load('./Impact_Regular.json', (font) => {
	const geometrySettings = {
		font: font,
		size: 40,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 0.5,
		bevelSegments: 20,
	};
	const textGeoGame = new THREE.TextGeometry('Game', geometrySettings);
	const textGeoStop = new THREE.TextGeometry('Stop', geometrySettings);

	const textMatGame = new THREE.MeshLambertMaterial({ color: 0xcccccc });
	const textMatStop = new THREE.MeshLambertMaterial({ color: 0xce2121 });

	const textGame = new THREE.Mesh(textGeoGame, textMatGame);
	const textStop = new THREE.Mesh(textGeoStop, textMatStop);
	textGame.position.set(-100, 0, 20);
	textStop.position.set(30, 0, 20);

	textGame.castShadow = true;
	scene.add(textGame, textStop);
});
//Model Loaders

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
const models = { moon: {}, rocket: {} };
//moon
gltfLoader.load('./moon/scene.gltf', (gltf) => {
	models.moon = gltf.scene;
	console.log(gltf);
	scene.add(models.moon);
	models.moon.scale.set(0.1, 0.1, 0.1);
	models.moon.position.set(0, 0, 0);
});
//rocket
gltfLoader.load('./rocket/scene.gltf', (gltf) => {
	models.rocket = gltf.scene;
	scene.add(models.rocket);
	models.rocket.scale.set(200, 200, 200);
	models.rocket.position.set(0, -20, -30);
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000
);
camera.position.set(0, 50, 200);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 250;
controls.minDistance = 150;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	// Update Orbital Controls
	controls.update();
	camera.position.x = Math.sin(elapsedTime) * 100;
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
