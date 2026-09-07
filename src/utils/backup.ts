import { ProfileData, CareerItem, ProjectItem, PersonalItem } from '../types';
import { getSyncImageVault, isUserUploadedImage } from './storage';

export interface PortfolioBackupData {
  version: number;
  exportDate: string;
  app: string;
  profile: ProfileData;
  careerItems: CareerItem[];
  projects: ProjectItem[];
  personalItems: PersonalItem[];
  imageVault: Record<string, string>;
}

/**
 * Export the full portfolio dataset including all embedded images as a downloadable JSON file.
 */
export function exportPortfolioBackup(
  profile: ProfileData,
  careerItems: CareerItem[],
  projects: ProjectItem[],
  personalItems: PersonalItem[]
): void {
  const vault = getSyncImageVault();
  
  const backupData: PortfolioBackupData = {
    version: 1,
    exportDate: new Date().toISOString(),
    app: "Jacob Lanning Portfolio",
    profile,
    careerItems,
    projects,
    personalItems,
    imageVault: vault
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jacob-lanning-portfolio-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download a single image (Data URL or Web URL) to the user's computer
 */
export function downloadImage(url: string, suggestedFilename: string): void {
  if (!url) return;

  // Derive file extension
  let ext = 'jpg';
  if (url.startsWith('data:image/png')) ext = 'png';
  else if (url.startsWith('data:image/webp')) ext = 'webp';
  else if (url.startsWith('data:image/svg')) ext = 'svg';
  else if (url.includes('.png')) ext = 'png';
  else if (url.includes('.webp')) ext = 'webp';

  const cleanBase = suggestedFilename.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  const filename = cleanBase.endsWith(`.${ext}`) ? cleanBase : `${cleanBase}.${ext}`;

  // If it's a data URL or blob, we can download directly
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // If it's a remote URL, fetch as blob to trigger direct save
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((err) => {
      console.warn('Direct fetch failed, opening URL in new tab:', err);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

/**
 * Download all photos currently in the portfolio sequentially to the user's machine
 */
export function downloadAllPortfolioImages(images: { name: string; url: string }[]): void {
  images.forEach((img, idx) => {
    setTimeout(() => {
      downloadImage(img.url, img.name);
    }, idx * 300);
  });
}

/**
 * Parse and validate a user-selected backup JSON file
 */
export async function parseBackupFile(file: File): Promise<PortfolioBackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON format');
        }
        if (!parsed.profile && !parsed.careerItems && !parsed.projects) {
          throw new Error('File does not appear to be a Jacob Lanning Portfolio backup.');
        }
        resolve(parsed);
      } catch (err: any) {
        reject(new Error(err?.message || 'Failed to parse backup JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
