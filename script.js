import * as THREE from "https://cdn.skypack.dev/three@0.152.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.152.2/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.152.2/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, mixer;

init();
animate();

function init() {
  // Scène
  scene = new THREE.Scene();

  // Caméra
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  // Rendu
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lumière
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 3, 2);
  scene.add(light);

  // Contrôles
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 5;
  controls.target.set(0, 1.5, 0);
  controls.update();

  // Chargement du modèle GLB
  const loader = new GLTFLoader();
  loader.load(
    "https://models.readyplayer.me/687f1af2041002c23477fa00.glb", // Ton lien
    function (gltf) {
      const model = gltf.scene;
      scene.add(model);

      // Animation
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }
    },
    undefined,
    function (error) {
      console.error("Erreur lors du chargement du modèle :", error);
    }
  );

  // Redimensionnement
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.01);
  renderer.render(scene, camera);
}
