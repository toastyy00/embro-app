/**
 * Kompresi gambar client-side menggunakan HTML5 Canvas.
 * Mengubah gambar ke format WebP (atau fallback JPEG) dengan resolusi maksimal
 * dan kualitas optimal untuk menghemat kapasitas Firebase Storage tanpa mengurangi ketajaman teks/pola.
 *
 * @param {string} dataUrl - Base64 Data URL dari file gambar
 * @param {number} maxDimension - Batas lebar/tinggi maksimal (default 1280px)
 * @param {number} quality - Kualitas kompresi 0.0 - 1.0 (default 0.80)
 * @returns {Promise<{ dataUrl: string, sizeKb: number, format: string }>}
 */
export function compressImageBase64(dataUrl, maxDimension = 1280, quality = 0.80) {
  return new Promise((resolve) => {
    if (!dataUrl) {
      resolve({ dataUrl: '', sizeKb: 0, format: 'NONE' });
      return;
    }

    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxDimension || h > maxDimension) {
        if (w > h) {
          h = Math.round((h * maxDimension) / w);
          w = maxDimension;
        } else {
          w = Math.round((w * maxDimension) / h);
          h = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ dataUrl, sizeKb: Math.round((dataUrl.length * 3) / 4 / 1024), format: 'RAW' });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      // Cek dukungan WebP untuk kompresi teks & grafik yang tajam tanpa artefak
      let outputType = 'image/webp';
      let compressed = '';
      try {
        compressed = canvas.toDataURL('image/webp', quality);
        if (!compressed.startsWith('data:image/webp')) {
          outputType = 'image/jpeg';
          compressed = canvas.toDataURL('image/jpeg', quality);
        }
      } catch (err) {
        outputType = 'image/jpeg';
        compressed = canvas.toDataURL('image/jpeg', quality);
      }

      const sizeKb = Math.round((compressed.length * 3) / 4 / 1024);
      resolve({
        dataUrl: compressed,
        sizeKb,
        format: outputType.split('/')[1].toUpperCase(),
      });
    };

    img.onerror = () => {
      const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
      resolve({ dataUrl, sizeKb, format: 'RAW' });
    };

    img.src = dataUrl;
  });
}
