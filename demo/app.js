const fallbackSamples = [
  {
    label: "Bug explanation",
    prompt: "Why does this API retry loop never stop?",
    baseline:
      "The retry loop never stops because the retry counter is stored inside the request handler, so it resets to zero on every new attempt. The terminating condition is therefore never reached, and the code keeps retrying indefinitely. Move the counter to state that survives across attempts.",
    caveman:
      "Retry counter stored inside request handler. Each retry resets counter to zero. Terminal condition never hit. Move counter to state that survives retries.",
    steno:
      "Retry ctr lives inside req handler -> resets each attempt -> no terminal hit. Persist ctr across attempts.",
  },
  {
    label: "Code review",
    prompt: "Review this fix for shared-state mutation.",
    baseline:
      "The null-input case is handled now, but the function still mutates shared state before returning. That can leak changes into later calls and make the bug intermittent. Clone the object before writing to it.",
    caveman:
      "Null input handled. Shared state still mutated before return. Bug can leak into later calls. Clone object before write.",
    steno:
      "Null case fixed. Shared state still mutates pre-return -> leaks into later calls. Clone object pre-write.",
  },
  {
    label: "Architecture explanation",
    prompt: "Explain database connection pooling.",
    baseline:
      "Connection pooling keeps a reusable set of open database connections instead of creating and closing a new connection for every request. That reduces handshake overhead, improves latency, and prevents avoidable load spikes under traffic.",
    caveman:
      "Pool reuses open database connections. No new connection for every request. Less handshake overhead. Faster under load.",
    steno:
      "Pool reuses open DB conns vs per-req open-close. Cuts handshake cost + latency. Better under load.",
  },
];

const pctReduction = (base, value) => Math.round(((base - value) / base) * 100);
const benchmark = window.__STENO_BENCHMARK__;
const samples = benchmark?.samples ?? fallbackSamples;

const productIdentity = {
  id: "stenographer-mode",
  userId: "@stenographer_mode",
  command: "/steno",
  platforms: 4,
};

const select = document.getElementById("prompt-select");
const comparisonGrid = document.getElementById("comparison-grid");
const bars = document.getElementById("bars");
const copyStatus = document.getElementById("copy-status");
const platformCount = document.getElementById("platform-count");

const averages = benchmark?.averages ?? {
  baseline: Math.round(samples.reduce((acc, sample) => acc + Math.ceil(sample.baseline.length / 4), 0) / samples.length),
  caveman: Math.round(samples.reduce((acc, sample) => acc + Math.ceil(sample.caveman.length / 4), 0) / samples.length),
  steno: Math.round(samples.reduce((acc, sample) => acc + Math.ceil(sample.steno.length / 4), 0) / samples.length)
};

// Update metrics
const sampleCount = benchmark?.sampleCount ?? samples.length;
const stenoBeatsPct = averages.stenoBeatsCavemanPct ?? 0;

const sampleCountEl = document.getElementById("sample-count");
const stenoWinsEl = document.getElementById("steno-wins");

if (sampleCountEl) sampleCountEl.textContent = String(sampleCount);
document.getElementById("caveman-reduction").textContent = `${averages.cavemanReduction ?? pctReduction(averages.baseline, averages.caveman)}%`;
document.getElementById("steno-reduction").textContent = `${averages.stenoReduction ?? pctReduction(averages.baseline, averages.steno)}%`;
if (stenoWinsEl) stenoWinsEl.textContent = `${stenoBeatsPct}%`;

platformCount.textContent = String(productIdentity.platforms);

samples.forEach((sample, index) => {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = sample.label;
  select.append(option);
});

function renderComparison(sampleIndex) {
  const sample = samples[sampleIndex];
  const tokenKeyByMode = {
    Baseline: "baseline",
    Caveman: "caveman",
    Stenographer: "steno"
  };
  const modes = [
    { name: "Baseline", color: "var(--base)", text: sample.baseline },
    { name: "Caveman", color: "var(--caveman)", text: sample.caveman },
    { name: "Stenographer", color: "var(--steno)", text: sample.steno },
  ];

  comparisonGrid.innerHTML = "";

  modes.forEach((mode) => {
    const tokenKey = tokenKeyByMode[mode.name];
    const tokenCount = sample.tokens?.[tokenKey] ?? Math.ceil(mode.text.length / 4);
    const delta =
      mode.name === "Baseline"
        ? 0
        : sample.tokens?.[`${mode.name.toLowerCase()}Reduction`] ?? pctReduction(sample.tokens?.baseline ?? Math.ceil(sample.baseline.length / 4), tokenCount);
    const card = document.createElement("article");
    card.className = "comparison-card";
    card.innerHTML = `
      <header>
        <h3>${mode.name}</h3>
        <span style="color:${mode.color}">${tokenCount} tok</span>
      </header>
      <p>${mode.text}</p>
      <div class="card-meta">
        <span>prompt: ${sample.prompt}</span>
        <span>${mode.name === "Baseline" ? "reference" : `${delta}% smaller`}</span>
      </div>
    `;
    comparisonGrid.append(card);
  });
}

function renderBars() {
  const rows = [
    { label: "Baseline", value: averages.baseline, color: "var(--base)" },
    { label: "Caveman", value: averages.caveman, color: "var(--caveman)" },
    { label: "Steno", value: averages.steno, color: "var(--steno)" },
  ];
  const max = Math.max(...rows.map((row) => row.value));
  bars.innerHTML = "";

  rows.forEach((row) => {
    const wrap = document.createElement("div");
    wrap.className = "bar-row";
    wrap.innerHTML = `
      <strong>${row.label}</strong>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(row.value / max) * 100}%; background:${row.color}"></div>
      </div>
      <span>${row.value} tok</span>
    `;
    bars.append(wrap);
  });
}

select.addEventListener("change", (event) => {
  renderComparison(Number(event.target.value));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy");
    copyStatus.innerHTML = `Command ready: <code>${text}</code>`;

    try {
      await navigator.clipboard.writeText(text);
      copyStatus.innerHTML = `Copied command: <code>${text}</code>`;
    } catch {
      copyStatus.innerHTML = `Copy blocked in this page context. Command: <code>${text}</code>`;
    }
  });
});

renderComparison(0);
renderBars();
renderCategoryStats();

function renderCategoryStats() {
  const categoryGrid = document.getElementById("category-grid");
  if (!categoryGrid) return;
  
  const categoryStats = benchmark?.categoryStats;
  if (!categoryStats) {
    categoryGrid.innerHTML = "<p>Run <code>npm run benchmark</code> to generate category stats.</p>";
    return;
  }
  
  categoryGrid.innerHTML = "";
  
  const sortedCategories = Object.entries(categoryStats).sort((a, b) => {
    // Sort by steno reduction descending (best performance first)
    return b[1].stenoReduction - a[1].stenoReduction;
  });
  
  for (const [category, stats] of sortedCategories) {
    const card = document.createElement("article");
    const isStenoFavored = stats.verdict === "steno-favored";
    const verdictClass = isStenoFavored ? "accent-steno" : "accent-caveman";
    const verdictLabel = isStenoFavored ? "✓ steno wins" : "⚠ caveman wins";
    
    card.className = `metric-card ${verdictClass}`;
    card.innerHTML = `
      <p class="metric-label">${category}</p>
      <p class="metric-value">${stats.stenoReduction}%</p>
      <p class="metric-note">${stats.count} samples · ${verdictLabel}</p>
    `;
    categoryGrid.append(card);
  }
}