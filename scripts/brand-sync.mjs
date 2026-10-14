// Copy the brand assets from the @davideimola/brand package into the places the
// site serves them from. The brand repo (github.com/davideimola/brand) draws and
// rasterises every asset; this site never redraws one. Run after bumping the
// dependency, then commit the result:
//
//   pnpm brand:sync
//
// - public/brand/          every SVG and PNG, served for download on /brand
// - src/app/icon.svg       the favicon (adapts to the system theme on its own)
// - src/app/apple-icon.png the iOS home-screen icon
//
// public/brand/LICENSE.md is the site's own copy of the asset license and is
// left alone.
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = path.join(repo, "node_modules", "@davideimola", "brand", "assets");
const out = path.join(repo, "public", "brand");

await mkdir(out, { recursive: true });

// Start clean so an asset the brand drops does not linger here.
for (const entry of await readdir(out)) {
  if (entry !== "LICENSE.md") await rm(path.join(out, entry));
}

let copied = 0;
for (const dir of ["svg", "png"]) {
  for (const file of await readdir(path.join(pkg, dir))) {
    await copyFile(path.join(pkg, dir, file), path.join(out, file));
    copied++;
  }
}

// The favicon ships without a <title>; the linter (and screen readers that
// meet it inline) want one.
const favicon = await readFile(path.join(pkg, "svg", "favicon.svg"), "utf8");
await writeFile(
  path.join(repo, "src", "app", "icon.svg"),
  favicon.replace(/^(<svg[^>]*>)/, "$1<title>Davide Imola</title>")
);
await copyFile(
  path.join(pkg, "png", "apple-touch-icon-180.png"),
  path.join(repo, "src", "app", "apple-icon.png")
);

console.log(`brand:sync: ${copied} assets in public/brand, favicon and apple icon updated`);
