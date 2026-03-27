#!/usr/bin/env node
/**
 * Optimize blog images: converts JPEG/PNG to WebP and resizes if needed.
 * Usage:
 *   pnpm optimize-images                       # process all images in public/images/blog/
 *   pnpm optimize-images path/to/dir           # process a directory
 *   pnpm optimize-images path/to/file.jpg      # process a single file
 *   pnpm optimize-images --clean               # also delete originals after conversion
 *   pnpm optimize-images path/to/dir --clean   # directory + delete originals
 *
 * Output: writes .webp next to the original.
 */

import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";

const BLOG_IMAGES_DIR = "public/images/blog";
const MAX_WIDTH = 1600; // hero images don't need to be wider than this
const WEBP_QUALITY = 85;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findImages(fullPath)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeImage(filePath, clean = false) {
  const ext = extname(filePath).toLowerCase();
  const outPath = join(dirname(filePath), `${basename(filePath, ext)}.webp`);

  const image = sharp(filePath);
  const meta = await image.metadata();
  const shouldResize = meta.width && meta.width > MAX_WIDTH;

  await image
    .resize(shouldResize ? { width: MAX_WIDTH } : undefined)
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  const originalStat = await stat(filePath);
  const outputStat = await stat(outPath);
  const saving = (
    ((originalStat.size - outputStat.size) / originalStat.size) *
    100
  ).toFixed(1);

  if (clean) {
    await unlink(filePath);
  }

  console.log(
    `✓ ${filePath} → ${outPath} (${saving}% smaller, ${(outputStat.size / 1024).toFixed(0)}KB)${clean ? " [original removed]" : ""}`
  );
  return outPath;
}

async function main() {
  const args = process.argv.slice(2);
  const clean = args.includes("--clean");
  const target = args.find((a) => !a.startsWith("--"));

  let files;
  if (!target) {
    files = await findImages(BLOG_IMAGES_DIR);
  } else {
    const targetStat = await stat(target);
    files = targetStat.isDirectory() ? await findImages(target) : [target];
  }

  if (files.length === 0) {
    console.log("No JPEG/PNG images found.");
    process.exit(0);
  }

  console.log(`Optimizing ${files.length} image(s)${clean ? " (--clean: originals will be removed)" : ""}...\n`);
  let converted = 0;

  for (const file of files) {
    try {
      await optimizeImage(file, clean);
      converted++;
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone. ${converted}/${files.length} converted.`);
}

main();
