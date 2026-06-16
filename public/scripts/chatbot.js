(function () {
  const widget = document.getElementById("chatbot-widget");
  if (!widget) return;

  const config = JSON.parse(widget.dataset.config || "{}");
  const toggleBtn = document.getElementById("chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const messages = document.getElementById("chatbot-messages");
  const topicsEl = document.getElementById("chatbot-topics");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const closeBtn = document.getElementById("chatbot-close");

  function closePanel() {
    panel.setAttribute("hidden", "");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  function addBubble(text, who) {
    const div = document.createElement("div");
    div.className = "chat-bubble " + who;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderTopics() {
    topicsEl.innerHTML = "";
    config.topics.forEach(function (topic) {
      const btn = document.createElement("button");
      btn.textContent = topic.label;
      btn.addEventListener("click", function () {
        addBubble(topic.label, "user");
        answerTopic(topic);
      });
      topicsEl.appendChild(btn);
    });
  }

  function answerTopic(topic) {
    addBubble(topic.answer, "bot");
    if (topic.cta) {
      const link = document.createElement("a");
      link.href = topic.cta.href;
      link.className = "btn btn-primary";
      link.style.marginTop = "0.5rem";
      link.style.display = "inline-block";
      link.textContent = topic.cta.label;
      messages.appendChild(link);
    }
  }

  function findTopic(text) {
    const normalized = text.toLowerCase();
    return config.topics.find(function (topic) {
      return topic.keywords.some(function (kw) { return normalized.includes(kw); });
    });
  }

  let initialized = false;
  toggleBtn.addEventListener("click", function () {
    const isHidden = panel.hasAttribute("hidden");
    if (isHidden) {
      panel.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (!initialized) {
        addBubble(config.greeting, "bot");
        renderTopics();
        initialized = true;
      }
    } else {
      closePanel();
    }
  });

  closeBtn.addEventListener("click", closePanel);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    addBubble(value, "user");
    const topic = findTopic(value);
    if (topic) {
      answerTopic(topic);
    } else {
      addBubble(config.fallback, "bot");
      renderTopics();
    }
    input.value = "";
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hasAttribute("hidden")) {
      closePanel();
    }
  });
})();
