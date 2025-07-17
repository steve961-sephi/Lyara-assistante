const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

// ⚠️ TA CLÉ API OPENAI : sécurise-la côté serveur si tu publies !
const apiKey = "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";

async function callOpenAIAPI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
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
    const response = await callOpenAIAPI(message);
    chatLog.lastChild.innerHTML = `<strong>Lyara:</strong> ${response}`;
    speak(response);
  } catch (error) {
    chatLog.lastChild.innerHTML = `<strong>Lyara:</strong> Désolée, une erreur est survenue.`;
    console.error(error);
  }
}
