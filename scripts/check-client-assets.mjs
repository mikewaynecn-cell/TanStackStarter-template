import { gzipSync } from "node:zlib";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const clientDirectory = path.join(projectRoot, "dist", "client");
const assetsDirectory = path.join(clientDirectory, "assets");
const maxChunkGzipBytes = 130 * 1024;

const files = await readdir(assetsDirectory);
const javascriptFiles = files.filter((file) => file.endsWith(".js"));

if (javascriptFiles.length === 0) {
  throw new Error("No client JavaScript chunks found; run the build first.");
}

const measured = await Promise.all(
  javascriptFiles.map(async (file) => {
    const source = await readFile(path.join(assetsDirectory, file));
    return { file, gzipBytes: gzipSync(source).byteLength };
  }),
);
const largest = measured.sort((a, b) => b.gzipBytes - a.gzipBytes)[0];

if (largest.gzipBytes > maxChunkGzipBytes) {
  throw new Error(
    `${largest.file} is ${largest.gzipBytes} bytes gzip; budget is ${maxChunkGzipBytes}.`,
  );
}

const headers = await readFile(path.join(clientDirectory, "_headers"), "utf8");
if (
  !headers.includes("/assets/*") ||
  !headers.includes("max-age=31536000") ||
  !headers.includes("immutable")
) {
  throw new Error("Built assets are missing the immutable cache policy.");
}

console.log(
  `client-assets: largest JS chunk ${largest.file} is ${Math.round(largest.gzipBytes / 1024)} KiB gzip (budget 130 KiB)`,
);
