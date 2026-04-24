import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { encode } from "gpt-tokenizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const corpusPath = path.join(repoRoot, "benchmarks", "corpus.json");
const jsonOutputPath = path.join(repoRoot, "benchmarks", "latest.json");
const jsOutputPath = path.join(repoRoot, "demo", "benchmark-data.js");
const releasePath = path.join(repoRoot, "release.json");

const pctReduction = (baseline, value) => Math.round(((baseline - value) / baseline) * 100);

const corpus = JSON.parse(await fs.readFile(corpusPath, "utf8"));

const samples = corpus.samples.map((sample) => {
  const baselineTokens = encode(sample.baseline).length;
  const cavemanTokens = encode(sample.caveman).length;
  const stenoTokens = encode(sample.steno).length;

  return {
    ...sample,
    tokens: {
      baseline: baselineTokens,
      caveman: cavemanTokens,
      steno: stenoTokens,
      cavemanReduction: pctReduction(baselineTokens, cavemanTokens),
      stenoReduction: pctReduction(baselineTokens, stenoTokens),
      stenoBeatsCaveman: stenoTokens < cavemanTokens
    }
  };
});

// Calculate category-level statistics
const categories = [...new Set(samples.map(s => s.category).filter(Boolean))];
const categoryStats = {};

for (const category of categories) {
  const catSamples = samples.filter(s => s.category === category);
  const count = catSamples.length;
  
  const avgBaseline = Math.round(catSamples.reduce((sum, s) => sum + s.tokens.baseline, 0) / count);
  const avgCaveman = Math.round(catSamples.reduce((sum, s) => sum + s.tokens.caveman, 0) / count);
  const avgSteno = Math.round(catSamples.reduce((sum, s) => sum + s.tokens.steno, 0) / count);
  
  const stenoBeatsCavemanCount = catSamples.filter(s => s.tokens.stenoBeatsCaveman).length;
  
  categoryStats[category] = {
    count,
    avgBaseline,
    avgCaveman,
    avgSteno,
    cavemanReduction: pctReduction(avgBaseline, avgCaveman),
    stenoReduction: pctReduction(avgBaseline, avgSteno),
    stenoBeatsCavemanPct: Math.round((stenoBeatsCavemanCount / count) * 100),
    verdict: avgSteno <= avgCaveman ? "steno-favored" : "caveman-favored"
  };
}

const averages = {
  baseline: Math.round(samples.reduce((sum, sample) => sum + sample.tokens.baseline, 0) / samples.length),
  caveman: Math.round(samples.reduce((sum, sample) => sum + sample.tokens.caveman, 0) / samples.length),
  steno: Math.round(samples.reduce((sum, sample) => sum + sample.tokens.steno, 0) / samples.length)
};

const stenoBeatsCavemanTotal = samples.filter(s => s.tokens.stenoBeatsCaveman).length;

const benchmark = {
  tokenizer: "gpt-tokenizer",
  generatedAt: new Date().toISOString(),
  sampleCount: samples.length,
  categories: categories.length,
  averages: {
    ...averages,
    cavemanReduction: pctReduction(averages.baseline, averages.caveman),
    stenoReduction: pctReduction(averages.baseline, averages.steno),
    stenoBeatsCavemanPct: Math.round((stenoBeatsCavemanTotal / samples.length) * 100)
  },
  categoryStats,
  samples
};

await fs.writeFile(jsonOutputPath, `${JSON.stringify(benchmark, null, 2)}\n`, "utf8");
await fs.writeFile(jsOutputPath, `window.__STENO_BENCHMARK__ = ${JSON.stringify(benchmark, null, 2)};\n`, "utf8");

const release = JSON.parse(await fs.readFile(releasePath, "utf8"));
release.status.benchmark = "exact";
release.benchmark = {
  tokenizer: benchmark.tokenizer,
  generatedAt: benchmark.generatedAt,
  artifact: "benchmarks/latest.json"
};

await fs.writeFile(releasePath, `${JSON.stringify(release, null, 2)}\n`, "utf8");

console.log(`Wrote ${jsonOutputPath}`);
console.log(`Wrote ${jsOutputPath}`);