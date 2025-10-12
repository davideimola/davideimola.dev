#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script unico per ottimizzare tutte le immagini del sito
 * Trova automaticamente tutte le immagini e le ottimizza
 */

const config = {
  // Qualità di compressione
  quality: 80,
  
  // Dimensioni per diversi usi
  sizes: {
    profile: { width: 400, height: 400 },
    hero: { width: 800, height: 600 },
    card: { width: 600, height: 400 },
    thumbnail: { width: 300, height: 200 },
    blog: { width: 1200, height: 630 },
    project: { width: 800, height: 450 },
    gallery: { width: 1000, height: 667 },
    logo: { width: 200, height: 200 } // Loghi quadrati, mantengono aspect ratio
  },
  
  // Formato di output
  format: 'webp'
};

/**
 * Trova tutte le immagini nel progetto
 */
function findAllImages(dir, allImages = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ricorsivamente cerca nelle sottocartelle
      findAllImages(fullPath, allImages);
    } else {
      const ext = path.extname(file).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png'].includes(ext);
      const isNotOptimized = !file.includes('-profile') && 
                            !file.includes('-hero') && 
                            !file.includes('-card') && 
                            !file.includes('-thumbnail') &&
                            !file.includes('-blog') &&
                            !file.includes('-project') &&
                            !file.includes('-gallery');
      
      if (isImage && isNotOptimized) {
        allImages.push(fullPath);
      }
    }
  }
  
  return allImages;
}

/**
 * Determina il tipo di immagine dal percorso e nome
 */
function getImageType(imagePath, fileName) {
  const baseName = path.parse(fileName).name.toLowerCase();
  const dirName = path.dirname(imagePath).toLowerCase();
  
  // Controlla se è un logo
  if (baseName.includes('logo') || dirName.includes('logo')) {
    return 'logo';
  }
  
  // Controlla il nome del file
  if (baseName.includes('profile') || baseName.includes('avatar') || baseName.includes('davide')) {
    return 'profile';
  }
  if (baseName.includes('hero') || baseName.includes('banner')) {
    return 'hero';
  }
  if (baseName.includes('thumb')) {
    return 'thumbnail';
  }
  if (baseName.includes('blog') || baseName.includes('post') || baseName.includes('article')) {
    return 'blog';
  }
  if (baseName.includes('project') || baseName.includes('osday') || baseName.includes('schrodinger')) {
    return 'project';
  }
  if (baseName.includes('gallery') || baseName.includes('full') || baseName.includes('wide')) {
    return 'gallery';
  }
  
  // Controlla la cartella
  if (dirName.includes('blog')) {
    return 'blog';
  }
  if (dirName.includes('project')) {
    return 'project';
  }
  if (dirName.includes('gallery')) {
    return 'gallery';
  }
  if (dirName.includes('logo')) {
    return 'logo';
  }
  
  // Default
  return 'card';
}

/**
 * Ottimizza una singola immagine
 */
async function optimizeImage(imagePath) {
  const fileName = path.basename(imagePath);
  const dirName = path.dirname(imagePath);
  const baseName = path.parse(fileName).name;
  
  const imageType = getImageType(imagePath, fileName);
  const size = config.sizes[imageType];
  
  const outputFileName = `${baseName}-${imageType}.${config.format}`;
  const outputPath = path.join(dirName, outputFileName);
  
  try {
    console.log(`🔄 Elaborando: ${fileName} → ${outputFileName}`);
    
    // Ottieni le dimensioni originali
    const originalStats = fs.statSync(imagePath);
    const originalSizeKB = Math.round(originalStats.size / 1024);
    
    // Determina il tipo di resize
    let resizeOptions;
    if (imageType === 'profile') {
      resizeOptions = {
        fit: 'cover',
        position: 'top'
      };
    } else if (imageType === 'blog') {
      // Per le immagini del blog, ridimensiona mantenendo l'aspect ratio
      resizeOptions = {
        fit: 'inside' // Ridimensiona per entrare nel contenitore senza ritagliare
      };
    } else if (imageType === 'logo') {
      // Per i loghi, mantieni l'aspect ratio e aggiungi sfondo trasparente se necessario
      resizeOptions = {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Sfondo trasparente
      };
    } else {
      resizeOptions = {
        fit: 'cover',
        position: 'center'
      };
    }
    
    // Ottimizza l'immagine
    await sharp(imagePath)
      .resize(size.width, size.height, resizeOptions)
      .webp({ quality: config.quality })
      .toFile(outputPath);
    
    // Controlla il risultato
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSizeKB = Math.round(optimizedStats.size / 1024);
    const savings = Math.round(((originalSizeKB - optimizedSizeKB) / originalSizeKB) * 100);
    
    console.log(`  ✅ ${outputFileName} (${originalSizeKB}KB → ${optimizedSizeKB}KB, -${savings}%)`);
    
    return {
      success: true,
      original: fileName,
      optimized: outputFileName,
      originalSize: originalSizeKB,
      optimizedSize: optimizedSizeKB,
      savings,
      type: imageType
    };
    
  } catch (error) {
    console.log(`  ❌ Errore: ${error.message}`);
    return {
      success: false,
      original: fileName,
      error: error.message
    };
  }
}

/**
 * Funzione principale
 */
async function optimizeAllImages() {
  console.log('🚀 Avvio ottimizzazione immagini...\n');
  
  // Trova tutte le immagini nel progetto
  const imagesDir = path.join(__dirname, '../public');
  const allImages = findAllImages(imagesDir);
  
  if (allImages.length === 0) {
    console.log('❌ Nessuna immagine da ottimizzare trovata');
    console.log('📁 Aggiungi immagini in public/images/ o sottocartelle');
    return;
  }
  
  console.log(`📸 Trovate ${allImages.length} immagini da ottimizzare\n`);
  
  const results = [];
  
  // Ottimizza tutte le immagini
  for (const imagePath of allImages) {
    const result = await optimizeImage(imagePath);
    results.push(result);
  }
  
  // Riepilogo
  console.log('\n📊 RIEPILOGO OTTIMIZZAZIONE');
  console.log('========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalOptimizedSize = successful.reduce((sum, r) => sum + r.optimizedSize, 0);
    const totalSavings = Math.round(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100);
    
    successful.forEach(result => {
      console.log(`✅ ${result.optimized}: ${result.originalSize}KB → ${result.optimizedSize}KB (-${result.savings}%, ${result.type})`);
    });
    
    console.log(`\n📈 Statistiche:`);
    console.log(`   • Immagini ottimizzate: ${successful.length}`);
    console.log(`   • Dimensione totale originale: ${totalOriginalSize}KB`);
    console.log(`   • Dimensione totale ottimizzata: ${totalOptimizedSize}KB`);
    console.log(`   • Risparmio totale: ${totalSavings}% (${totalOriginalSize - totalOptimizedSize}KB)`);
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ Errori (${failed.length}):`);
    failed.forEach(result => {
      console.log(`   • ${result.original}: ${result.error}`);
    });
  }
  
  console.log('\n🎉 Ottimizzazione completata!');
  console.log('📁 Le immagini ottimizzate sono state salvate nella stessa cartella');
}

// Esegui lo script
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAllImages().catch(console.error);
}

export { optimizeAllImages, optimizeImage };
