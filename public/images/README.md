# Ottimizzazione Immagini

## Come usare:

1. **Aggiungi le tue immagini** in qualsiasi cartella del progetto (`public/`)
2. **Lo script trova automaticamente** tutte le immagini e le ottimizza

3. **Esegui lo script**:
   ```bash
   pnpm run optimize
   ```

## Risultati:
- Immagini ridimensionate automaticamente
- Formato WebP ottimizzato
- Compressione intelligente per il web
- File salvati nella stessa cartella con suffisso

## Dimensioni generate:
- **Profile**: 400x400px (foto profilo circolari)
- **Hero**: 800x600px (banner e sezioni principali)
- **Card**: 600x400px (card progetti e anteprime)
- **Thumbnail**: 300x200px (thumbnail e piccole anteprime)
- **Blog**: 1200x630px (immagini blog con aspect ratio preservato)
- **Project**: 800x450px (immagini progetti dettagliate)
- **Gallery**: 1000x667px (gallery e immagini full-width)
- **Logo**: 200x200px (loghi con aspect ratio preservato)

## Esempi:
- `davide-speaking.jpg` → `davide-speaking-profile.webp`
- `project-banner.png` → `project-banner-hero.webp`
- `osday-conference.jpg` → `osday-conference-project.webp`
- `blog-post.jpg` → `blog-post-blog.webp`
- `company-logo.png` → `company-logo-logo.webp`

## Note:
- Le immagini originali rimangono nella cartella
- Le immagini ottimizzate hanno suffisso tipo (-profile, -hero, etc.)
- Lo script ignora automaticamente le immagini già ottimizzate
- Riconosce automaticamente il tipo di immagine dal nome e cartella
