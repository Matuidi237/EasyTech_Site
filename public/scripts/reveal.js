(function () {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });
})();
