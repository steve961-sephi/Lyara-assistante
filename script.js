async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const message = inputField.value.trim();

  if (!message) return;

  // Affiche le message utilisateur
  chatLog.innerHTML += `<div class="user-msg"><strong>Vous :</strong> ${message}</div>`;
  inputField.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer VOTRE_CLÉ_API_ICI"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Désolée, je n'ai pas compris.";
    chatLog.innerHTML += `<div class="lyara-msg"><strong>Lyara :</strong> ${reply}</div>`;
  } catch (error) {
    chatLog.innerHTML += `<div class="lyara-msg error"><strong>Lyara :</strong> Erreur de réponse.</div>`;
    console.error(error);
  }
}
