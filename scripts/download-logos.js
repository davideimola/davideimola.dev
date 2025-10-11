#!/usr/bin/env node

/**
 * Utility script to download company logos using Clearbit Logo API
 *
 * Usage:
 *   node scripts/download-logos.js
 *
 * This will download logos for all companies in your experience.
 * Logos are saved to public/logos/
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Company domains mapping
const companyDomains = {
  RedCarbon: "redcarbon.ai",
  "Milkman Technologies": "milkmantechnologies.com",
  Codemotion: "codemotion.com",
  "ASEM S.r.l.": "asem.it",
  "EDALab Networked Embedded Systems": "edalab.it",
  "Schrödinger Hat": "schrodinger-hat.org",
};

const logosDir = path.join(__dirname, "..", "public", "logos");

// Create logos directory if it doesn't exist
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
  console.log("✓ Created logos directory");
}

/**
 * @param {string} company
 * @param {string} domain
 * @returns {Promise<string | null>}
 */
function downloadLogo(company, domain) {
  return new Promise((resolve, reject) => {
    const url = `https://logo.clearbit.com/${domain}`;
    const filename = `${company.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
    const filepath = path.join(logosDir, filename);

    console.log(`Downloading logo for ${company}...`);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filepath);
          response.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`✓ Saved: /logos/${filename}`);
            resolve(`/logos/${filename}`);
          });
        } else if (response.statusCode === 404) {
          console.log(`✗ Logo not found for ${company} (${domain})`);
          resolve(null);
        } else {
          console.log(
            `✗ Failed to download ${company}: ${response.statusCode}`,
          );
          resolve(null);
        }
      })
      .on("error", (err) => {
        console.error(`✗ Error downloading ${company}:`, err.message);
        resolve(null);
      });
  });
}

async function main() {
  console.log("🎨 Company Logo Downloader\n");
  console.log("Downloading logos using Clearbit API...\n");

  /** @type {Record<string, string | null>} */
  const results = {};

  for (const [company, domain] of Object.entries(companyDomains)) {
    const logoPath = await downloadLogo(company, domain);
    if (logoPath) {
      results[company] = logoPath;
    }
  }

  console.log("\n📋 Summary:");
  console.log("━".repeat(50));

  Object.entries(companyDomains).forEach(([company, domain]) => {
    const status = results[company] ? "✓" : "✗";
    console.log(`${status} ${company}`);
  });

  console.log(
    "\n💡 To add logos to your experience, update the experience array:",
  );
  console.log("\nconst experiences = [");
  console.log("  {");
  console.log('    company: "RedCarbon",');
  console.log('    logo: "/logos/redcarbon.png", // Add this line');
  console.log("    // ... rest of the data");
  console.log("  },");
  console.log("];");

  console.log("\n✨ Done!\n");
}

main();
