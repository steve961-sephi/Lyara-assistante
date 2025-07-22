import * as THREE from "https://cdn.skypack.dev/three";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, mixer;
initScene();
animate();

function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(1, 3, 2);
  scene.add(dirLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.5, 0);
  controls.update();

  const loader = new GLTFLoader();
  loader.load(
    "https://models.readyplayer.me/687f1af2041002c23477fa00.glb",
    function (gltf) {
      const model = gltf.scene;
      scene.add(model);

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

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

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("👤", message);
  input.value = "";

  const response = await getLyaraResponse(message);
  addMessage("🤖", response);
  speak(response);
}

function addMessage(sender, text) {
  const chatLog = document.getElementById("chat-log");
  const p = document.createElement("p");
  p.innerText = `${sender} ${text}`;
  chatLog.appendChild(p);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

// 🔐 Clé API OpenAI ici
const OPENAI_API_KEY = "sk-proj-..."; // <-- Mets ta clé ici

async function getLyaraResponse(userMessage) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "Je n'ai pas compris.";
  } catch (err) {
    console.error("Erreur OpenAI:", err);
    return "Erreur de connexion.";
  }
}
