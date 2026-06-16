(function () {
  const form = document.getElementById("demo-form");
  if (!form) return;
  const feedback = form.querySelector(".form-feedback");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    feedback.textContent = "";
    feedback.className = "form-feedback";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form)
      });

      if (res.ok) {
        feedback.textContent = feedback.dataset.success;
        feedback.classList.add("success");
        form.reset();
      } else {
        feedback.textContent = feedback.dataset.error;
        feedback.classList.add("error");
      }
    } catch (err) {
      feedback.textContent = feedback.dataset.error;
      feedback.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
    }
  });
})();
