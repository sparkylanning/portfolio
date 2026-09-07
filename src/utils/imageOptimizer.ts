/**
 * Client-side image optimization utility
 * Resizes and compresses images to ~80KB-160KB so they can be saved reliably
 * without exceeding browser storage quotas, while maintaining crisp visual quality.
 */

export interface OptimizeResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  dimensions: { width: number; height: number };
}

export async function optimizeImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.74
): Promise<OptimizeResult> {
  // Check if it's an image
  const isImageMime = file.type.startsWith('image/');
  const isImageExt = /\.(jpe?g|png|webp|gif|svg|bmp|heic|avif)$/i.test(file.name);

  if (!isImageMime && !isImageExt) {
    throw new Error('Please select an image file (JPEG, PNG, WebP, SVG, GIF).');
  }

  // If SVG, preserve raw data URL
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            dataUrl: reader.result,
            originalSize: file.size,
            optimizedSize: file.size,
            dimensions: { width: 800, height: 600 }
          });
        } else {
          reject(new Error('Failed to read SVG file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
    });
  }

  // For bitmap images, resize using HTML5 Canvas with adaptive compression
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.naturalWidth || img.width || 800;
        let height = img.naturalHeight || img.height || 600;

        // Calculate aspect ratio scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context is not available.'));
          return;
        }

        // Clean neutral background
        ctx.fillStyle = '#FAF6EF';
        ctx.fillRect(0, 0, width, height);

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality JPEG with adaptive size control
        try {
          let currentQuality = quality;
          let optimizedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          let base64Length = optimizedDataUrl.length - (optimizedDataUrl.indexOf(',') + 1);
          let optimizedSize = Math.round((base64Length * 3) / 4);

          // If still over 95KB, adaptively step down quality so it easily fits storage
          if (optimizedSize > 95000) {
            currentQuality = 0.65;
            optimizedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
            base64Length = optimizedDataUrl.length - (optimizedDataUrl.indexOf(',') + 1);
            optimizedSize = Math.round((base64Length * 3) / 4);
          }

          resolve({
            dataUrl: optimizedDataUrl,
            originalSize: file.size,
            optimizedSize,
            dimensions: { width, height }
          });
        } catch (err) {
          if (typeof event.target?.result === 'string') {
            resolve({
              dataUrl: event.target.result,
              originalSize: file.size,
              optimizedSize: file.size,
              dimensions: { width, height }
            });
          } else {
            reject(new Error('Failed to encode image data.'));
          }
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to decode image. Please verify file is a valid image.'));
      };

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      } else {
        reject(new Error('Failed to read image file data.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}

/** Format bytes into human readable string like 1.2 MB or 95 KB */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
