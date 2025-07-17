const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const apiKeyInput = document.getElementById("api-key");
const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";

async function callOpenRouterAPI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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

  appendMessage("Lyara", "..."); // Indique que Lyara réfléchit

  try {
    const response = await callOpenRouterAPI(message);
    // Remplace le dernier message "..." par la vraie réponse
    chatLog.lastChild.innerHTML = `<strong>Lyara:</strong> ${response}`;
    speak(response);
  } catch (error) {
    // Remplace le dernier message par un message d’erreur
    chatLog.lastChild.innerHTML = `<strong>Lyara:</strong> Désolée, une erreur est survenue.`;
    console.error(error);
  }
}
