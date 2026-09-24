import { cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const release = join(root, "release");

rmSync(release, { recursive: true, force: true });
cpSync(dist, release, { recursive: true });
console.log("Copied dist/ to release/. Commit release/ with your source changes.");
