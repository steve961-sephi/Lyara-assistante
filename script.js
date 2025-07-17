const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

const memory = { name: null };

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("Vous", message);
  userInput.value = "";

  // Récupérer la clé API dans le champ caché
  const apiKeyInput = document.getElementById("api-key");
  const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";

  if (!apiKey) {
    appendMessage("Lyara", "⚠️ Clé API manquante. Merci de la renseigner.");
    return;
  }

  try {
    // Préparer la requête vers OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es Lyara, une assistante IA douce et attentionnée." },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) throw new Error(`Erreur API ${response.status}`);

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || "Désolée, je n'ai pas compris.";

    appendMessage("Lyara", botMessage);
    speak(botMessage);

  } catch (err) {
    appendMessage("Lyara", `Erreur : ${err.message}`);
  }
}

function appendMessage(sender, text) {
  const entry = document.createElement("div");
  entry.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatLog.appendChild(entry);
  chatLog.scrollTop = chatLog.scrollHeight;
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
