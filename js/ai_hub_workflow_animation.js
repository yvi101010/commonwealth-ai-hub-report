(function () {
  function setActive(buttons, activeId) {
    buttons.forEach((button) => {
      const isActive = button.dataset.stage === activeId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function detailMarkup(stage) {
    const agentTags = stage.agents.map((agent) => `<span>${agent}</span>`).join("");
    return `
      <p class="detail-kicker">對應 Agent</p>
      <div class="agent-tags">${agentTags}</div>
      <div class="detail-grid">
        <div>
          <h4>AI 可以協助</h4>
          <p>${stage.aiCan}</p>
        </div>
        <div>
          <h4>人仍然負責</h4>
          <p>${stage.humanStill}</p>
        </div>
        <div>
          <h4>容易誤解</h4>
          <p>${stage.misread}</p>
        </div>
      </div>
      <p class="source-line"></p>
    `;
  }

  window.renderWorkflow = function renderWorkflow(map) {
    const rail = document.querySelector("[data-workflow-rail]");
    const detail = document.querySelector("[data-workflow-detail]");
    if (!rail || !detail || !map || !Array.isArray(map.stages)) return;

    rail.innerHTML = map.stages
      .map(
        (stage, index) => `
          <button class="workflow-node${index === 0 ? " is-active" : ""}" type="button" data-stage="${stage.id}" aria-pressed="${index === 0}">
            <span class="node-index">${index + 1}</span>
            <span>${stage.stage}</span>
          </button>
        `
      )
      .join("");

    const buttons = Array.from(rail.querySelectorAll("button"));
    detail.innerHTML = detailMarkup(map.stages[0]);

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const stage = map.stages.find((item) => item.id === button.dataset.stage);
        if (!stage) return;
        setActive(buttons, stage.id);
        detail.innerHTML = detailMarkup(stage);
      });
    });
  };
})();
