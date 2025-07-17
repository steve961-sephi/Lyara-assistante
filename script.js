const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

// Mets ta clé API entre guillemets
const apiKey = "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

async function callOpenRouterAPI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
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

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("Vous", message);
  userInput.value = "";

  appendMessage("Lyara", "...");

  try {
    const response = await callOpenRouterAPI(message);
    chatLog.lastChild.innerHTML = `<strong>Lyara:</strong> ${response}`;
    speak(response);
  } catch (error) {
    chatLog.lastChild.innerHTML = `<strong>Lyara:</strong> Désolée, une erreur est survenue.`;
    console.error("Erreur:", error);
  }
}
