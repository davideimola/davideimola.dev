# Scripts

This directory contains utility scripts for the davideimola.dev website.

## Available Scripts

### `optimize.js`

Optimizes images in the `public/` directory for web performance.

**Usage:**
```bash
pnpm run optimize
```

**What it does:**
- Automatically detects image types (profile, hero, blog, project, logo, etc.)
- Resizes and compresses images to WebP format
- Applies appropriate cropping strategies for different image types
- Maintains aspect ratios and prevents unwanted cropping
