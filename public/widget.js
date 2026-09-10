(function () {
  var scriptTag = document.currentScript;
  var siteKey = scriptTag ? scriptTag.getAttribute("data-site") : null;
  if (!siteKey) {
    console.error("[TechWokx widget] Missing data-site attribute on the script tag.");
    return;
  }

  var apiBase = scriptTag.getAttribute("data-api") || "https://api.techwokx.online";
  var accent = scriptTag.getAttribute("data-accent") || "#7c3aed";

  var SESSION_KEY = "techwokx_widget_session_" + siteKey;
  var sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  var messages = [];
  var open = false;
  var sending = false;

  // ---- Styles (scoped via unique class prefix, no external CSS needed) ----
  var style = document.createElement("style");
  style.textContent =
    ".twx-bubble{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;" +
    "background:" + accent + ";box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;z-index:999999;" +
    "display:flex;align-items:center;justify-content:center;border:none;transition:transform .2s;}" +
    ".twx-bubble:hover{transform:scale(1.06);}" +
    ".twx-bubble svg{width:26px;height:26px;}" +
    ".twx-panel{position:fixed;bottom:88px;right:20px;width:340px;max-width:90vw;height:460px;" +
    "max-height:70vh;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.25);" +
    "z-index:999999;display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}" +
    ".twx-panel.twx-open{display:flex;}" +
    ".twx-header{background:" + accent + ";color:#fff;padding:14px 16px;font-size:14px;font-weight:600;}" +
    ".twx-messages{flex:1;overflow-y:auto;padding:12px;background:#f8f9fb;}" +
    ".twx-msg{max-width:80%;padding:8px 12px;border-radius:12px;margin-bottom:8px;font-size:13px;line-height:1.4;white-space:pre-wrap;}" +
    ".twx-msg.user{background:" + accent + ";color:#fff;margin-left:auto;border-bottom-right-radius:2px;}" +
    ".twx-msg.assistant{background:#fff;color:#1a1a2e;border:1px solid #eee;margin-right:auto;border-bottom-left-radius:2px;}" +
    ".twx-msg.typing{color:#999;font-style:italic;}" +
    ".twx-inputrow{display:flex;gap:6px;padding:10px;border-top:1px solid #eee;background:#fff;}" +
    ".twx-input{flex:1;border:1px solid #ddd;border-radius:20px;padding:8px 14px;font-size:13px;outline:none;}" +
    ".twx-send{background:" + accent + ";color:#fff;border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;flex-shrink:0;}" +
    ".twx-send:disabled{opacity:.5;cursor:default;}";
  document.head.appendChild(style);

  // ---- DOM ----
  var bubble = document.createElement("button");
  bubble.className = "twx-bubble";
  bubble.setAttribute("aria-label", "Chat with us");
  bubble.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  var panel = document.createElement("div");
  panel.className = "twx-panel";
  panel.innerHTML =
    '<div class="twx-header">Chat with us</div>' +
    '<div class="twx-messages"></div>' +
    '<div class="twx-inputrow">' +
    '<input class="twx-input" type="text" placeholder="Ask a question..." />' +
    '<button class="twx-send" aria-label="Send">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
    "</button>" +
    "</div>";

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  var messagesEl = panel.querySelector(".twx-messages");
  var inputEl = panel.querySelector(".twx-input");
  var sendEl = panel.querySelector(".twx-send");

  function render() {
    messagesEl.innerHTML = "";
    messages.forEach(function (m) {
      var div = document.createElement("div");
      div.className = "twx-msg " + m.role;
      div.textContent = m.content;
      messagesEl.appendChild(div);
    });
    if (sending) {
      var typing = document.createElement("div");
      typing.className = "twx-msg assistant typing";
      typing.textContent = "Typing...";
      messagesEl.appendChild(typing);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function toggle() {
    open = !open;
    panel.className = "twx-panel" + (open ? " twx-open" : "");
    if (open && messages.length === 0) {
      messages.push({
        role: "assistant",
        content: "Hi! How can I help you today?",
      });
      render();
    }
  }

  async function send() {
    var text = inputEl.value.trim();
    if (!text || sending) return;
    inputEl.value = "";
    messages.push({ role: "user", content: text });
    sending = true;
    render();

    try {
      var res = await fetch(apiBase + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteKey: siteKey, sessionId: sessionId, message: text }),
      });
      var data = await res.json();
      sending = false;
      if (!res.ok) {
        messages.push({
          role: "assistant",
          content: data.error || "Something went wrong. Please try again.",
        });
      } else {
        messages.push({ role: "assistant", content: data.reply });
      }
    } catch (e) {
      sending = false;
      messages.push({
        role: "assistant",
        content: "Couldn't reach the assistant right now. Please try again shortly.",
      });
    }
    render();
  }

  bubble.addEventListener("click", toggle);
  sendEl.addEventListener("click", send);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") send();
  });
})();
