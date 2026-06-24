(function () {
  function stepMarkup(steps) {
    return steps
      .map(
        (step, index) => `
          <li>
            <span>${index + 1}</span>
            <strong>${step}</strong>
          </li>
        `
      )
      .join("");
  }

  function paintFunnel(root, data, mode) {
    const payload = data[mode];
    const label = root.querySelector("[data-funnel-label]");
    const list = root.querySelector("[data-funnel-steps]");
    const note = root.querySelector("[data-funnel-note]");
    if (!payload || !label || !list || !note) return;
    root.dataset.mode = mode;
    label.textContent = payload.label;
    list.innerHTML = stepMarkup(payload.steps);
    note.textContent = payload.note;
    root.querySelectorAll("[data-funnel-mode]").forEach((button) => {
      const active = button.dataset.funnelMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  window.renderFunnelToggle = function renderFunnelToggle(data) {
    document.querySelectorAll("[data-funnel-widget]").forEach((root) => {
      paintFunnel(root, data, "before");
      root.querySelectorAll("[data-funnel-mode]").forEach((button) => {
        button.addEventListener("click", () => {
          paintFunnel(root, data, button.dataset.funnelMode);
        });
      });
    });
  };
})();
