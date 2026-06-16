(function () {
  function animateCounter(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^([\d\s,.]+)(.*)$/);
    if (!match) return;
    const digits = match[1].replace(/[\s,.]/g, "");
    const target = parseInt(digits, 10);
    if (Number.isNaN(target)) return;
    const suffix = match[2] || "";
    const locale = document.documentElement.lang === "en" ? "en-US" : "fr-FR";
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString(locale) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString(locale) + suffix;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll(".trust-metrics strong, .about-stats strong").forEach(function (el) {
    observer.observe(el);
  });
})();
