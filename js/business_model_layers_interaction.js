(function () {
  function layerMarkup(layer) {
    return `
      <div class="layer-detail-head">
        <span>${layer.status}</span>
        <h4>${layer.layer}</h4>
      </div>
      <p>${layer.claim}</p>
      <dl class="evidence-dl">
        <div>
          <dt>證據</dt>
          <dd>${layer.evidence}</dd>
        </div>
        <div>
          <dt>界線</dt>
          <dd>${layer.boundary}</dd>
        </div>
      </dl>
      <p class="source-line">來源提示：${layer.source}</p>
    `;
  }

  window.renderBusinessLayers = function renderBusinessLayers(layers) {
    const tabs = document.querySelector("[data-business-tabs]");
    const detail = document.querySelector("[data-business-detail]");
    if (!tabs || !detail || !Array.isArray(layers)) return;

    tabs.innerHTML = layers
      .map(
        (layer, index) => `
          <button type="button" class="layer-tab${index === 0 ? " is-active" : ""}" data-layer="${layer.id}" aria-pressed="${index === 0}">
            <span>${layer.layer}</span>
            <strong>${layer.status}</strong>
          </button>
        `
      )
      .join("");

    detail.innerHTML = layerMarkup(layers[0]);

    tabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const layer = layers.find((item) => item.id === button.dataset.layer);
        if (!layer) return;
        tabs.querySelectorAll("button").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        detail.innerHTML = layerMarkup(layer);
      });
    });
  };
})();
