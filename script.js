const fallbackEvidence = {
  funnel: {
    before: {
      label: "Before：SEO 搜尋漏斗",
      steps: ["搜尋", "點擊網站", "閱讀文章", "廣告曝光／訂閱轉換"],
      note: "流量進入網站後，媒體才有機會累積廣告、訂閱或會員關係。"
    },
    after: {
      label: "After：AEO／AI Overview 漏斗",
      steps: ["提問或平台瀏覽", "AI 摘要先整理", "媒體可能被引用", "不一定點回原站"],
      note: "內容可能先被平台摘要吸收，媒體要爭取的不只點擊，還有可辨識、可引用與可信任。"
    },
    warning: "被看見，不等於被點擊；被引用，不等於被變現。"
  },
  businessLayers: [],
  boundarySummary: [],
  governance: {
    left: { title: "公司官方 AI 模板", points: [] },
    right: { title: "個人 AI 工具", points: [] },
    gate: "正式發布前仍須人工審核、查證與編輯判斷。"
  }
};

async function loadJson(path, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) return fallback;
    return await res.json();
  } catch (err) {
    return fallback;
  }
}

function renderEvidenceCards(items) {
  const mount = document.querySelector("[data-evidence-cards]");
  if (!mount || !Array.isArray(items)) return;
  mount.innerHTML = items
    .map(
      (item) => `
        <article class="evidence-card">
          <span>${item.type}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <small>${item.source}</small>
        </article>
      `
    )
    .join("");
}

function initGovernance(data) {
  const slider = document.querySelector("[data-governance-slider]");
  const label = document.querySelector("[data-governance-label]");
  const left = document.querySelector("[data-governance-left]");
  const right = document.querySelector("[data-governance-right]");
  const gate = document.querySelector("[data-governance-gate]");
  if (!slider || !label || !left || !right || !gate) return;

  const paint = () => {
    const value = Number(slider.value);
    label.textContent = value < 45 ? "偏重標準化治理" : value > 55 ? "偏重個人工作手感" : "兩者並行調整";
    document.documentElement.style.setProperty("--balance", `${value}%`);
  };

  const list = (items) => items.map((item) => `<li>${item}</li>`).join("");
  left.innerHTML = `<h3>${data.left.title}</h3><ul>${list(data.left.points)}</ul>`;
  right.innerHTML = `<h3>${data.right.title}</h3><ul>${list(data.right.points)}</ul>`;
  gate.textContent = data.gate;
  slider.addEventListener("input", paint);
  paint();
}

function renderBoundary(items) {
  const mount = document.querySelector("[data-boundary-summary]");
  if (!mount || !Array.isArray(items)) return;
  mount.innerHTML = items
    .map(
      (item, index) => `
        <article class="boundary-card">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${item.title}</h3>
          <strong>${item.status}</strong>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".section-nav a"));
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

function initSourceDrawer() {
  const button = document.querySelector("[data-source-toggle]");
  const panel = document.querySelector("[data-source-panel]");
  if (!button || !panel) return;
  button.addEventListener("click", () => {
    const open = panel.hasAttribute("hidden");
    panel.toggleAttribute("hidden", !open);
    button.setAttribute("aria-expanded", String(open));
  });
}

async function boot() {
  const [quotes, map, evidence] = await Promise.all([
    loadJson("data/ai_hub_interview_quotes.json", []),
    loadJson("data/ai_hub_agents_map.json", { stages: [] }),
    loadJson("data/ai_hub_evidence_cards.json", fallbackEvidence)
  ]);

  renderEvidenceCards(quotes);
  window.renderWorkflow?.(map);
  window.renderFunnelToggle?.(evidence.funnel);
  window.renderBusinessLayers?.(evidence.businessLayers);
  initGovernance(evidence.governance);
  renderBoundary(evidence.boundarySummary);
  initScrollSpy();
  initSourceDrawer();
}

boot();
