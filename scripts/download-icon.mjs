#!/usr/bin/env node
// Usage: npm run download-icon -- <url> <output-name> <subfolder> [size]
//
// <url>         Source image URL (e.g. https://example.com/icon.webp)
// <output-name> Output filename without extension (e.g. "my-relic-set")
// <subfolder>   Destination under src/assets/icons/ (characters|light-cones|relic-sets|planar-sets)
// [size]        Output size in pixels, default 64

import { execFileSync } from "node:child_process"
import { createWriteStream, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { pipeline } from "node:stream/promises"

const [url, name, subfolder, size = "64"] = process.argv.slice(2)

if (!url || !name || !subfolder) {
  console.error("Usage: node scripts/download-icon.mjs <url> <output-name> <subfolder> [size]")
  console.error("  subfolder: characters | light-cones | relic-sets | planar-sets")
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "src", "assets", "icons", subfolder)
const outFile = join(outDir, `${name}.webp`)

if (!existsSync(outDir)) {
  console.error(`Error: output directory does not exist: ${outDir}`)
  process.exit(1)
}

const tmp = join(tmpdir(), `icon-download-${Date.now()}.webp`)

console.log(`Downloading ${url}...`)
const res = await fetch(url)
if (!res.ok) {
  console.error(`Error: HTTP ${res.status} ${res.statusText}`)
  process.exit(1)
}
await pipeline(res.body, createWriteStream(tmp))

console.log(`Scaling to ${size}x${size}...`)
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-vf", `scale=${size}:${size}:flags=lanczos`, outFile])

import { rmSync } from "node:fs"
rmSync(tmp, { force: true })

console.log(`Saved: src/assets/icons/${subfolder}/${name}.webp`)
