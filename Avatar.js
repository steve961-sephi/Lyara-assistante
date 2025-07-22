import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.4, 2.5);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('avatar-canvas').appendChild(renderer.domElement);

// Lumière douce
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemiLight);

// Lumière directionnelle
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// Charge l’avatar GLB
const loader = new GLTFLoader();
loader.load('https://models.readyplayer.me/687f1af2041002c23477fa00.glb', function (gltf) {
  const avatar = gltf.scene;
  avatar.scale.set(1.4, 1.4, 1.4);
  scene.add(avatar);

  // Animation simple de rotation
  function animate() {
    requestAnimationFrame(animate);
    avatar.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  animate();
}, undefined, function (error) {
  console.error('Erreur lors du chargement de l’avatar :', error);
});
