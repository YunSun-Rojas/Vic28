import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const folderPath = path.join(process.cwd(), 'public', 'fotos');

if (!fs.existsSync(folderPath)) {
  console.error(`❌ No se encontró la carpeta: ${folderPath}`);
  process.exit(1);
}

const files = fs.readdirSync(folderPath);

console.log('Iniciando conversión de imágenes a WebP...\n');

files.forEach(async (file) => {
  const ext = path.extname(file).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const inputFilePath = path.join(folderPath, file);
    const nameWithoutExt = path.basename(file, ext);
    const outputFilePath = path.join(folderPath, `${nameWithoutExt}.webp`);

    try {
      await sharp(inputFilePath)
        .resize({ width: 800, withoutEnlargement: true }) // Redimensiona a max 800px de ancho
        .webp({ quality: 80 })                           // Compresión óptima al 80%
        .toFile(outputFilePath);

      console.log(`✅ Convertido: ${file}  ➡️  ${nameWithoutExt}.webp`);
    } catch (err) {
      console.error(`❌ Error en ${file}:`, err);
    }
  }
});