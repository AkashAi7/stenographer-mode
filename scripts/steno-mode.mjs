#!/usr/bin/env node

import { access, copyFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const command = process.argv[2] ?? "install";
const options = parseArgs(process.argv.slice(3));
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePrompt = path.join(repoRoot, "bundles", "vscode", "steno.prompt.md");
const promptFileName = "steno.prompt.md";
const legacyPromptFileNames = ["stenographer.prompt.md", "stenographer-mode.prompt.md"];

const scope = options.scope ?? "user";

try {
  if (!isSupportedCommand(command)) {
    throw new Error(`Unknown command: ${command}. Use install, uninstall, or where.`);
  }

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
  return value === "install" || value === "uninstall" || value === "where";
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
      directory: resolveUserPromptDirectory(),
    });
  }

  if (normalizedScope === "project" || normalizedScope === "all") {
    targets.push({
      label: "project",
      directory: path.join(projectRoot, ".github", "prompts"),
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

async function installTargets(targets) {
  for (const target of targets) {
    await mkdir(target.directory, { recursive: true });

    const destination = path.join(target.directory, promptFileName);
    await copyFile(sourcePrompt, destination);

    for (const legacyFileName of legacyPromptFileNames) {
      await rm(path.join(target.directory, legacyFileName), { force: true });
    }

    console.log(`Installed ${target.label} prompt -> ${destination}`);
  }

  console.log("Use /steno in VS Code prompt picker or invoke by description.");
}

async function uninstallTargets(targets) {
  let removedCount = 0;

  for (const target of targets) {
    const fileNames = [promptFileName, ...legacyPromptFileNames];

    for (const fileName of fileNames) {
      const targetPath = path.join(target.directory, fileName);
      const removed = await removeIfExists(targetPath);

      if (removed) {
        removedCount += 1;
        console.log(`Removed ${targetPath}`);
      }
    }
  }

  if (removedCount === 0) {
    console.log("No installed prompt files found for the requested scope.");
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
    console.log(`${target.label}: ${path.join(target.directory, promptFileName)}`);
  }
}