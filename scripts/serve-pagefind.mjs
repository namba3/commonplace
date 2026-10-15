#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const destArg = args.find((arg) => arg.startsWith("--dest-dir="));
const destIndex = args.indexOf("--dest-dir");
const site = path.resolve(
  repo,
  destArg ? destArg.slice("--dest-dir=".length) : destIndex >= 0 ? args[destIndex + 1] : "book",
);

let child;
let indexing = false;
let rebuildPending = false;
let shuttingDown = false;
let failure = false;

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, commandArgs, { cwd: repo, stdio: "inherit" });
    process.once("error", reject);
    process.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${signal ?? code}`));
    });
  });
}

async function generateIndex() {
  if (indexing) {
    rebuildPending = true;
    return;
  }
  indexing = true;
  do {
    rebuildPending = false;
    try {
      console.log("[pagefind] Preparing mdBook pages and rebuilding the search index...");
      await run("python3", ["scripts/prepare-pagefind.py", "--site", site]);
      await run("npm", ["exec", "--", "pagefind", "--site", site]);
      await run("python3", ["scripts/verify-pagefind.py", "--site", site]);
      failure = false;
      console.log("[pagefind] Search index is ready.");
    } catch (error) {
      failure = true;
      console.error(`[pagefind] ${error.message}`);
    }
  } while (rebuildPending && !shuttingDown);
  indexing = false;
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  child?.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child = spawn("mdbook", ["serve", ...args], { cwd: repo, stdio: ["inherit", "pipe", "pipe"] });
const outputs = [child.stdout, child.stderr].map((stream) => createInterface({ input: stream }));
for (const output of outputs) {
  output.on("line", (line) => {
    console.log(line);
    if (line.includes("HTML book written to")) void generateIndex();
  });
}
child.once("error", (error) => {
  console.error(`Could not start mdbook serve: ${error.message}`);
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  outputs.forEach((output) => output.close());
  if (failure || (code !== 0 && !signal)) process.exitCode = 1;
  else process.exitCode = code ?? 0;
});
