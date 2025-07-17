// script.js
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

const memory = { name: null };

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("Vous", message);
  userInput.value = "";

  const response = generateResponse(message);
  appendMessage("Lyara", response);
  speak(response);
}

function appendMessage(sender, text) {
  const entry = document.createElement("div");
  entry.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatLog.appendChild(entry);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function generateResponse(msg) {
  const lower = msg.toLowerCase();

  if (lower.startsWith("je m'appelle")) {
    const name = msg.split("je m'appelle")[1].trim();
    memory.name = name;
    return `Enchantée ${name} 😊 Je m'en souviendrai.`;
  }
  if (lower.includes("mon nom est")) {
    const name = msg.split("mon nom est")[1].trim();
    memory.name = name;
    return `Très bien, ${name}, noté ! 😄`;
  }
  if (lower.includes("comment je m'appelle")) {
    return memory.name ? `Tu t'appelles ${memory.name} !` : "Je ne connais pas encore ton prénom 🙈";
  }
  if (lower.includes("bonjour") || lower.includes("salut")) {
    return memory.name ? `Bonjour ${memory.name} ! 😊` : "Bonjour ! Quel est ton prénom ?";
  }
  if (lower.includes("merci")) {
    return "Avec plaisir ! Je suis là pour toi 🌟";
  }
  if (lower.includes("qui es-tu") || lower.includes("tu es qui")) {
    return "Je suis Lyara, ton assistante IA douce et toujours à l'écoute ✨";
  }
  if (lower.includes("aide") || lower.includes("capable")) {
    return "Je peux discuter, me souvenir de ton prénom, et bientôt lire des documents 📚";
  }
  return "Hmm... je ne suis pas encore sûre de ce que tu veux dire 🤔";
}

function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = 1;
  utter.pitch = 1.1;
  synth.speak(utter);
}
