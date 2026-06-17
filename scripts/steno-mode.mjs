#!/usr/bin/env node

import { access, copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const command = process.argv[2] ?? "install";
const options = parseArgs(process.argv.slice(3));
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePrompt = path.join(repoRoot, "bundles", "vscode", "steno.prompt.md");
const sourceCompressPrompt = path.join(repoRoot, "bundles", "vscode", "steno-compress.prompt.md");
const sourceConvertGithubPrompt = path.join(repoRoot, "bundles", "vscode", "steno-convert-github.prompt.md");
const sourceCopilotInstructions = path.join(repoRoot, ".github", "copilot-instructions.md");
const sourceAgent = path.join(repoRoot, ".github", "agents", "steno.agent.md");
const sourceSkill = path.join(repoRoot, ".github", "skills", "steno", "SKILL.md");
const promptFileName = "steno.prompt.md";
const compressPromptFileName = "steno-compress.prompt.md";
const convertGithubPromptFileName = "steno-convert-github.prompt.md";
const copilotInstructionsFileName = "copilot-instructions.md";
const agentFileName = "steno.agent.md";
const skillDirectoryName = "steno";
const skillFileName = "SKILL.md";
const legacyPromptFileNames = ["stenographer.prompt.md", "stenographer-mode.prompt.md", "steno-compressor.prompt.md"];
const legacySkillDirectoryNames = ["stenographer"];

const scope = options.scope ?? "user";

try {
  if (!isSupportedCommand(command)) {
    throw new Error(`Unknown command: ${command}. Use install, uninstall, where, or convert-github.`);
  }

  if (command === "convert-github") {
    const projectRoot = path.resolve(options.projectDir ?? process.cwd());
    const mode = options.mode ?? "preview";
    await runConvertGithub(projectRoot, mode);
  } else {
    const targets = resolveTargets(scope, options.projectDir);

    switch (command) {
      case "install":
        await installTargets(targets);
        break;
      case "uninstall":
        await uninstallTargets(targets);
        break;
      case "where":
        printTargets(targets);
        break;
      default:
        throw new Error(`Unhandled command: ${command}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function parseArgs(args) {
  const parsed = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const key = normalizeOptionName(arg.slice(2));
    const value = args[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

function normalizeOptionName(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function isSupportedCommand(value) {
  return value === "install" || value === "uninstall" || value === "where" || value === "convert-github";
}

async function runConvertGithub(projectRoot, mode) {
  const normalizedMode = mode.toLowerCase();

  if (normalizedMode !== "preview" && normalizedMode !== "apply") {
    throw new Error(`Unsupported mode: ${mode}. Use preview or apply.`);
  }

  const files = await findConvertibleGithubFiles(projectRoot);

  if (files.length === 0) {
    console.log("No matching .github files were found for conversion.");
    return;
  }

  if (normalizedMode === "preview") {
    console.log(`Preview mode: ${files.length} file(s) match conversion scope.`);
    for (const filePath of files) {
      console.log(`- ${path.relative(projectRoot, filePath)}`);
    }
    return;
  }

  let changedCount = 0;

  for (const filePath of files) {
    const original = await readFile(filePath, "utf8");
    const converted = compressStenoText(original);

    if (converted !== original) {
      await writeFile(filePath, converted, "utf8");
      changedCount += 1;
      console.log(`Updated ${path.relative(projectRoot, filePath)}`);
    } else {
      console.log(`Skipped (no change) ${path.relative(projectRoot, filePath)}`);
    }
  }

  console.log(`Apply mode complete: ${changedCount}/${files.length} file(s) updated.`);
}

async function findConvertibleGithubFiles(projectRoot) {
  const githubRoot = path.join(projectRoot, ".github");
  const filePaths = [];

  try {
    await access(githubRoot);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  await walkFiles(githubRoot, filePaths);

  const matches = filePaths.filter((filePath) => {
    const relativePath = path.relative(projectRoot, filePath).split(path.sep).join("/");

    if (relativePath === ".github/copilot-instructions.md") {
      return true;
    }

    if (relativePath.startsWith(".github/instructions/") && relativePath.endsWith(".instructions.md")) {
      return true;
    }

    if (relativePath.startsWith(".github/agents/") && relativePath.endsWith(".agent.md")) {
      return true;
    }

    if (relativePath.startsWith(".github/prompts/") && relativePath.endsWith(".prompt.md")) {
      return true;
    }

    return /^\.github\/skills\/.+\/SKILL\.md$/u.test(relativePath);
  });

  matches.sort((left, right) => left.localeCompare(right));
  return matches;
}

async function walkFiles(currentDirectory, outFilePaths) {
  const entries = await readdir(currentDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const resolvedPath = path.join(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      await walkFiles(resolvedPath, outFilePaths);
      continue;
    }

    if (entry.isFile()) {
      outFilePaths.push(resolvedPath);
    }
  }
}

function compressStenoText(content) {
  const protectedBlocks = [];
  let transformed = content;

  transformed = transformed.replace(/```[\s\S]*?```/gu, (match) => protectBlock(match, protectedBlocks));
  transformed = transformed.replace(/`[^`\r\n]+`/gu, (match) => protectBlock(match, protectedBlocks));

  transformed = transformed
    .replace(/\bconfigurations\b/gu, "cfgs")
    .replace(/\bconfiguration\b/gu, "cfg")
    .replace(/\bauthentication\b/gu, "auth")
    .replace(/\bdependencies\b/gu, "deps")
    .replace(/\bdependency\b/gu, "dep")
    .replace(/\benvironments\b/gu, "envs")
    .replace(/\benvironment\b/gu, "env")
    .replace(/\brequests\b/gu, "reqs")
    .replace(/\brequest\b/gu, "req")
    .replace(/\bresponses\b/gu, "resps")
    .replace(/\bresponse\b/gu, "resp")
    .replace(/\bimplementations\b/gu, "impls")
    .replace(/\bimplementation\b/gu, "impl")
    .replace(/\bperformance\b/gu, "perf")
    .replace(/\barchitecture\b/gu, "arch")
    .replace(/\bcontexts\b/gu, "ctxs")
    .replace(/\bcontext\b/gu, "ctx")
    .replace(/\bcounters\b/gu, "ctrs")
    .replace(/\bcounter\b/gu, "ctr")
    .replace(/\bwithout\b/gu, "w/o")
    .replace(/\bwith\b/gu, "w/")
    .replace(/\bversus\b/gu, "vs");

  transformed = transformed.replace(/__STENO_BLOCK_(\d+)__/gu, (_, blockIndex) => protectedBlocks[Number(blockIndex)]);
  return transformed;
}

function protectBlock(value, blocks) {
  const blockIndex = blocks.push(value) - 1;
  return `__STENO_BLOCK_${blockIndex}__`;
}

function resolveTargets(scopeValue, projectDirOption) {
  const normalizedScope = scopeValue.toLowerCase();

  if (normalizedScope !== "user" && normalizedScope !== "project" && normalizedScope !== "all") {
    throw new Error(`Unsupported scope: ${scopeValue}. Use user, project, or all.`);
  }

  const projectRoot = path.resolve(projectDirOption ?? process.cwd());
  const targets = [];

  if (normalizedScope === "user" || normalizedScope === "all") {
    targets.push({
      label: "user",
      promptDirectory: resolveUserPromptDirectory(),
      agentDirectory: resolveUserAgentDirectory(),
      skillDirectory: resolveUserSkillDirectory(),
    });
  }

  if (normalizedScope === "project" || normalizedScope === "all") {
    targets.push({
      label: "project",
      projectRoot,
      promptDirectory: path.join(projectRoot, ".github", "prompts"),
      agentDirectory: path.join(projectRoot, ".github", "agents"),
      skillDirectory: path.join(projectRoot, ".github", "skills", skillDirectoryName),
    });
  }

  return targets;
}

function resolveUserPromptDirectory() {
  switch (process.platform) {
    case "win32": {
      const appData = process.env.APPDATA;

      if (!appData) {
        throw new Error("APPDATA is not set, so the VS Code user prompt directory cannot be resolved.");
      }

      return path.join(appData, "Code", "User", "prompts");
    }
    case "darwin":
      return path.join(os.homedir(), "Library", "Application Support", "Code", "User", "prompts");
    default: {
      const configHome = process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");
      return path.join(configHome, "Code", "User", "prompts");
    }
  }
}

function resolveUserAgentDirectory() {
  return path.join(os.homedir(), ".copilot", "agents");
}

function resolveUserSkillDirectory() {
  return path.join(os.homedir(), ".copilot", "skills", skillDirectoryName);
}

async function installTargets(targets) {
  for (const target of targets) {
    await mkdir(target.promptDirectory, { recursive: true });
    await mkdir(target.agentDirectory, { recursive: true });
    await mkdir(target.skillDirectory, { recursive: true });

    if (target.projectRoot) {
      await mkdir(path.join(target.projectRoot, ".github"), { recursive: true });
    }

    const promptDestination = path.join(target.promptDirectory, promptFileName);
    const compressPromptDestination = path.join(target.promptDirectory, compressPromptFileName);
    const convertGithubPromptDestination = path.join(target.promptDirectory, convertGithubPromptFileName);
    const copilotInstructionsDestination = target.projectRoot
      ? path.join(target.projectRoot, ".github", copilotInstructionsFileName)
      : null;
    const agentDestination = path.join(target.agentDirectory, agentFileName);
    const skillDestination = path.join(target.skillDirectory, skillFileName);
    await copyFile(sourcePrompt, promptDestination);
    await copyFile(sourceCompressPrompt, compressPromptDestination);
    await copyFile(sourceConvertGithubPrompt, convertGithubPromptDestination);
    if (copilotInstructionsDestination && path.resolve(copilotInstructionsDestination) !== path.resolve(sourceCopilotInstructions)) {
      await copyFile(sourceCopilotInstructions, copilotInstructionsDestination);
    }
    await copyFile(sourceAgent, agentDestination);
    await copyFile(sourceSkill, skillDestination);

    for (const legacyFileName of legacyPromptFileNames) {
      await rm(path.join(target.promptDirectory, legacyFileName), { force: true });
    }

    console.log(`Installed ${target.label} prompt -> ${promptDestination}`);
    console.log(`Installed ${target.label} prompt -> ${compressPromptDestination}`);
    console.log(`Installed ${target.label} prompt -> ${convertGithubPromptDestination}`);
    if (copilotInstructionsDestination) {
      console.log(`Installed ${target.label} instructions -> ${copilotInstructionsDestination}`);
    }
    console.log(`Installed ${target.label} agent -> ${agentDestination}`);
    console.log(`Installed ${target.label} skill -> ${skillDestination}`);

    for (const legacySkillDirName of legacySkillDirectoryNames) {
      const legacySkillPath = path.join(path.dirname(target.skillDirectory), legacySkillDirName);
      if (legacySkillPath !== target.skillDirectory) {
        await rm(legacySkillPath, { recursive: true, force: true });
      }
    }
  }

  console.log('Use /steno once, say "Steno Mode", or switch to the Steno agent to keep Steno Mode active across modes and agents.');
}

async function uninstallTargets(targets) {
  let removedCount = 0;

  for (const target of targets) {
    const promptFileNames = [promptFileName, compressPromptFileName, convertGithubPromptFileName, ...legacyPromptFileNames];

    for (const fileName of promptFileNames) {
      const targetPath = path.join(target.promptDirectory, fileName);
      const removed = await removeIfExists(targetPath);

      if (removed) {
        removedCount += 1;
        console.log(`Removed ${targetPath}`);
      }
    }

    const agentPath = path.join(target.agentDirectory, agentFileName);
    const removedAgent = await removeIfExists(agentPath);

    if (removedAgent) {
      removedCount += 1;
      console.log(`Removed ${agentPath}`);
    }

    const skillPath = path.join(target.skillDirectory, skillFileName);
    const removedSkill = await removeIfExists(skillPath);

    if (removedSkill) {
      removedCount += 1;
      console.log(`Removed ${skillPath}`);
    }

    for (const legacySkillDirName of legacySkillDirectoryNames) {
      const legacySkillPath = path.join(path.dirname(target.skillDirectory), legacySkillDirName, skillFileName);
      const removedLegacySkill = await removeIfExists(legacySkillPath);
      if (removedLegacySkill) {
        removedCount += 1;
        console.log(`Removed ${legacySkillPath}`);
      }
    }

    if (target.projectRoot) {
      const copilotInstructionsPath = path.join(target.projectRoot, ".github", copilotInstructionsFileName);
      const removedInstructions = path.resolve(copilotInstructionsPath) !== path.resolve(sourceCopilotInstructions)
        ? await removeIfExists(copilotInstructionsPath)
        : false;

      if (removedInstructions) {
        removedCount += 1;
        console.log(`Removed ${copilotInstructionsPath}`);
      }
    }
  }

  if (removedCount === 0) {
    console.log("No installed prompt or agent files found for the requested scope.");
  }
}

async function removeIfExists(targetPath) {
  try {
    await access(targetPath);
    await rm(targetPath, { force: true });
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

function printTargets(targets) {
  for (const target of targets) {
    console.log(`${target.label} prompt: ${path.join(target.promptDirectory, promptFileName)}`);
    console.log(`${target.label} prompt: ${path.join(target.promptDirectory, compressPromptFileName)}`);
    console.log(`${target.label} prompt: ${path.join(target.promptDirectory, convertGithubPromptFileName)}`);
    if (target.projectRoot) {
      console.log(`${target.label} instructions: ${path.join(target.projectRoot, ".github", copilotInstructionsFileName)}`);
    }
    console.log(`${target.label} agent: ${path.join(target.agentDirectory, agentFileName)}`);
    console.log(`${target.label} skill: ${path.join(target.skillDirectory, skillFileName)}`);
  }
}