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
      stenoReduction: pctReduction(baselineTokens, stenoTokens)
    }
  };
});

const averages = {
  baseline: Math.round(samples.reduce((sum, sample) => sum + sample.tokens.baseline, 0) / samples.length),
  caveman: Math.round(samples.reduce((sum, sample) => sum + sample.tokens.caveman, 0) / samples.length),
  steno: Math.round(samples.reduce((sum, sample) => sum + sample.tokens.steno, 0) / samples.length)
};

const benchmark = {
  tokenizer: "gpt-tokenizer",
  generatedAt: new Date().toISOString(),
  averages: {
    ...averages,
    cavemanReduction: pctReduction(averages.baseline, averages.caveman),
    stenoReduction: pctReduction(averages.baseline, averages.steno)
  },
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