import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const releaseDir = join(root, "release");

function walk(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function manifest(dir) {
  const lines = new Map();
  for (const path of walk(dir)) {
    const rel = relative(dir, path).split("\\").join("/");
    const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
    lines.set(rel, hash);
  }
  return lines;
}

function run(bin, args) {
  const result = spawnSync(bin, args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(join(releaseDir, "index.html"))) {
  console.error("release/index.html is missing. On a dev machine run: npm run sync-release");
  process.exit(1);
}

const temp = join(root, ".release-check");
rmSync(temp, { recursive: true, force: true });
try {
  run("node", ["node_modules/typescript/bin/tsc", "--noEmit"]);
  run("node", ["node_modules/vite/bin/vite.js", "build", "--outDir", temp, "--emptyOutDir"]);
  const built = manifest(temp);
  const committed = manifest(releaseDir);
  const paths = new Set([...built.keys(), ...committed.keys()]);
  const problems = [];
  for (const path of [...paths].sort()) {
    if (!built.has(path)) problems.push(`only in release/: ${path}`);
    else if (!committed.has(path)) problems.push(`missing from release/: ${path}`);
    else if (built.get(path) !== committed.get(path)) problems.push(`differs: ${path}`);
  }
  if (problems.length > 0) {
    console.error("Committed release/ does not match the current source.");
    for (const problem of problems) console.error(`  ${problem}`);
    console.error("Refresh it with: npm run sync-release");
    process.exit(1);
  }
  console.log("release/ matches the current source.");
} finally {
  rmSync(temp, { recursive: true, force: true });
}
