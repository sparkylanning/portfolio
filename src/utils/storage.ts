import { CareerItem, ProjectItem, PersonalItem, ProfileData } from '../types';

/**
 * Robust Client Storage Utility using IndexedDB with localStorage fallback.
 * Allows storing images and portfolio state reliably without hitting
 * browser localStorage 5MB quota errors.
 */

const DB_NAME = 'jacob_portfolio_storage_v1';
const STORE_NAME = 'portfolio_store';
const DB_VERSION = 1;

export const IMAGE_VAULT_KEY = 'jacob_portfolio_permanent_image_vault';

// Known default seed images from initial portfolio data so we can distinguish user uploads
const DEFAULT_SEED_IMAGES = new Set([
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85'
]);

export function isUserUploadedImage(url: unknown): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  const trimmed = url.trim();
  // Base64 data URLs from Canvas / FileReader are 100% user uploads
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return true;
  // External or custom URLs not present in default seeds
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return !DEFAULT_SEED_IMAGES.has(trimmed);
  }
  return false;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open IndexedDB'));
      };
    });
  }

  return dbPromise;
}

/**
 * Save an item to IndexedDB (asynchronous) and attempt localStorage mirror
 */
export async function setPersistentItem<T>(key: string, value: T): Promise<void> {
  // Always try IndexedDB first
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Storage] IndexedDB write failed:', err);
  }

  // Also try localStorage as secondary quick cache (safely ignore QuotaExceededError)
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Quota exceeded in localStorage is expected if large images exist,
    // IndexedDB holds the authoritative data.
    console.info(`[Storage] localStorage quota full for "${key}", saved securely in IndexedDB.`);
  }
}

/**
 * Retrieve item from IndexedDB, falling back to localStorage or default
 */
export async function getPersistentItem<T>(key: string, fallback: T): Promise<T> {
  // Try IndexedDB first
  try {
    const db = await getDB();
    const result = await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (result !== undefined && result !== null) {
      return result;
    }
  } catch (err) {
    console.warn('[Storage] IndexedDB read failed, trying localStorage:', err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn('[Storage] localStorage read failed:', err);
  }

  return fallback;
}

/**
 * Synchronous read from localStorage for initial React state setup before async hydration
 */
export function getInitialSyncItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

/**
 * Remove an item from both storages
 */
export async function removePersistentItem(key: string): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Storage] IndexedDB delete error:', err);
  }

  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Clear all portfolio storage
 */
export async function clearAllPersistentItems(): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Storage] IndexedDB clear error:', err);
  }

  try {
    localStorage.clear();
  } catch {
    // ignore
  }
}

/**
 * Synchronous snapshot of the image vault from localStorage.
 * Also scans known legacy keys in localStorage to recover custom images immediately.
 */
export function getSyncImageVault(): Record<string, string> {
  const vault: Record<string, string> = {};

  // Check direct avatar key first for instantaneous headshot recovery
  try {
    const directAvatar = localStorage.getItem('jacob_avatar_img');
    if (directAvatar && isUserUploadedImage(directAvatar)) {
      vault['avatarImage'] = directAvatar;
      vault['avatar'] = directAvatar;
      vault['profile:avatarImage'] = directAvatar;
    }

    // Check individual jacob_img_ keys
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('jacob_img_')) {
        const val = localStorage.getItem(k);
        if (val && isUserUploadedImage(val)) {
          const rawId = k.replace('jacob_img_', '');
          vault[rawId] = val;
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    const raw = localStorage.getItem(IMAGE_VAULT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        Object.assign(vault, parsed);
      }
    }
  } catch {
    // ignore
  }

  // Also check legacy/versioned localStorage keys synchronously
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.includes('jacob_portfolio_')) continue;
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          extractImagesFromObject(parsed, vault);
        }
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  return vault;
}

/**
 * Persist the Image Vault to IndexedDB and attempt localStorage.
 */
export async function persistImageVault(vault: Record<string, string>): Promise<void> {
  await setPersistentItem(IMAGE_VAULT_KEY, vault);
}

/**
 * Register a user-uploaded image under its entity ID and fallbacks
 */
export async function recordUploadedImage(
  entityId: string,
  dataUrl: string,
  category?: 'profile' | 'career' | 'project' | 'personal'
): Promise<void> {
  if (!isUserUploadedImage(dataUrl)) return;

  // Immediate synchronous direct key saves in localStorage (bulletproof against quota/batch issues)
  try {
    const directKey = `jacob_img_${entityId}`;
    localStorage.setItem(directKey, dataUrl);
    if (category) {
      localStorage.setItem(`jacob_img_${category}_${entityId}`, dataUrl);
    }
    if (entityId === 'avatarImage' || entityId === 'avatar') {
      localStorage.setItem('jacob_avatar_img', dataUrl);
      localStorage.setItem('jacob_img_avatarImage', dataUrl);
      localStorage.setItem('jacob_img_avatar', dataUrl);
      localStorage.setItem('jacob_img_profile:avatarImage', dataUrl);
    }
  } catch (err) {
    console.warn('[Storage] Direct image key write warning:', err);
  }

  const currentVault = getSyncImageVault();
  currentVault[entityId] = dataUrl;
  if (category) {
    currentVault[`${category}:${entityId}`] = dataUrl;
  }
  // If it's avatar
  if (entityId === 'avatarImage' || entityId === 'avatar') {
    currentVault['avatarImage'] = dataUrl;
    currentVault['avatar'] = dataUrl;
    currentVault['profile:avatarImage'] = dataUrl;
  }

  // Also store individual direct key in IndexedDB as a resilient backup
  const directKey = `jacob_img_${entityId}`;
  await setPersistentItem(directKey, dataUrl);
  await persistImageVault(currentVault);
}

/**
 * Extracts any user-uploaded image from arbitrary parsed objects
 * into the given image map.
 */
export function extractImagesFromObject(obj: any, map: Record<string, string>): void {
  if (!obj || typeof obj !== 'object') return;

  // Case 1: Profile object
  if (obj.avatarImage && isUserUploadedImage(obj.avatarImage)) {
    map['avatarImage'] = obj.avatarImage;
    map['avatar'] = obj.avatarImage;
    map['profile:avatarImage'] = obj.avatarImage;
  }

  // Case 2: Direct image vault or dictionary
  if (!Array.isArray(obj) && !obj.id && !obj.name && !obj.role) {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && isUserUploadedImage(v)) {
        map[k] = v;
      }
    }
  }

  // Case 3: Array of items (career, projects, personal)
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      if (item && typeof item === 'object' && item.image && isUserUploadedImage(item.image)) {
        const img = item.image;
        if (item.id) {
          map[item.id] = img;
        }

        // Detect item type
        if ('company' in item) {
          // Career item
          if (item.id) map[`career:${item.id}`] = img;
          if (item.company) map[`career:${String(item.company).toLowerCase().trim()}`] = img;
          map[`career:index:${idx}`] = img;
        } else if ('keyOutcomes' in item || 'toolsUsed' in item || 'organization' in item) {
          // Project item
          if (item.id) map[`project:${item.id}`] = img;
          if (item.title) map[`project:${String(item.title).toLowerCase().trim()}`] = img;
          map[`project:index:${idx}`] = img;
        } else if ('subtitle' in item || 'tags' in item) {
          // Personal item
          if (item.id) map[`personal:${item.id}`] = img;
          if (item.title) map[`personal:${String(item.title).toLowerCase().trim()}`] = img;
          map[`personal:index:${idx}`] = img;
        }
      }
    });
  }
}

/**
 * Scan all records in both IndexedDB and localStorage (including all legacy versions
 * v7, v6, v5, v8, unversioned, etc.) to recover EVERY user-uploaded image.
 */
export async function scanAndRecoverAllImages(): Promise<Record<string, string>> {
  const recoveredMap: Record<string, string> = { ...getSyncImageVault() };

  // 1. Scan all localStorage entries
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      try {
        const val = localStorage.getItem(k);
        if (!val) continue;

        if (val.startsWith('"data:image/') || val.startsWith('data:image/')) {
          const clean = val.startsWith('"') ? JSON.parse(val) : val;
          recoveredMap[k] = clean;
          continue;
        }

        const parsed = JSON.parse(val);
        extractImagesFromObject(parsed, recoveredMap);
      } catch {
        // ignore parse error
      }
    }
  } catch (err) {
    console.warn('[Storage] localStorage deep scan error:', err);
  }

  // 2. Scan all IndexedDB entries
  try {
    const db = await getDB();
    const allRecords = await new Promise<{ key: IDBValidKey; value: any }[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const records: { key: IDBValidKey; value: any }[] = [];
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          records.push({ key: cursor.key, value: cursor.value });
          cursor.continue();
        } else {
          resolve(records);
        }
      };
      cursorReq.onerror = () => resolve(records);
    });

    for (const record of allRecords) {
      // If it's a direct image stored under jacob_img_
      if (typeof record.key === 'string' && record.key.startsWith('jacob_img_')) {
        const id = record.key.replace('jacob_img_', '');
        if (typeof record.value === 'string' && isUserUploadedImage(record.value)) {
          recoveredMap[id] = record.value;
        }
      }
      extractImagesFromObject(record.value, recoveredMap);
    }
  } catch (err) {
    console.warn('[Storage] IndexedDB deep scan error:', err);
  }

  // 3. Persist consolidated vault back into storage
  await persistImageVault(recoveredMap);

  return recoveredMap;
}

/**
 * Load persistent state checking primary key first, then fallback keys, then default.
 */
export async function loadPersistentStateWithFallback<T>(
  primaryKey: string,
  fallbackKeys: string[],
  fallbackDefault: T
): Promise<T> {
  // 1. Try primary key in IndexedDB
  const primaryVal = await getPersistentItem<T | null>(primaryKey, null);
  if (primaryVal !== null && primaryVal !== undefined) {
    return primaryVal;
  }

  // 2. Try each fallback key
  for (const fallbackKey of fallbackKeys) {
    const val = await getPersistentItem<T | null>(fallbackKey, null);
    if (val !== null && val !== undefined) {
      // Copy forward into primaryKey so it's cached for the future
      await setPersistentItem(primaryKey, val);
      return val;
    }
  }

  return fallbackDefault;
}

/**
 * Synchronous version for initial state
 */
export function getInitialSyncItemWithFallback<T>(
  primaryKey: string,
  fallbackKeys: string[],
  fallbackDefault: T
): T {
  const primaryVal = getInitialSyncItem<T | null>(primaryKey, null);
  if (primaryVal !== null && primaryVal !== undefined) {
    return primaryVal;
  }

  for (const fallbackKey of fallbackKeys) {
    const val = getInitialSyncItem<T | null>(fallbackKey, null);
    if (val !== null && val !== undefined) {
      return val;
    }
  }

  return fallbackDefault;
}

/**
 * Apply the image vault over active portfolio items, guaranteeing that
 * custom uploaded images are never replaced with stock images.
 */
export function applyImageVaultToState(
  profile: ProfileData,
  careerItems: CareerItem[],
  projects: ProjectItem[],
  personalItems: PersonalItem[],
  vault: Record<string, string>
): {
  profile: ProfileData;
  careerItems: CareerItem[];
  projects: ProjectItem[];
  personalItems: PersonalItem[];
  appliedCount: number;
} {
  let appliedCount = 0;

  // Profile avatar
  let avatarImage = profile.avatarImage;
  const directAvatar = typeof window !== 'undefined' ? localStorage.getItem('jacob_avatar_img') : null;
  const vaultAvatar = directAvatar || vault['avatarImage'] || vault['avatar'] || vault['profile:avatarImage'];
  if (vaultAvatar && isUserUploadedImage(vaultAvatar)) {
    avatarImage = vaultAvatar;
    appliedCount++;
  } else if (!isUserUploadedImage(avatarImage) && directAvatar && isUserUploadedImage(directAvatar)) {
    avatarImage = directAvatar;
    appliedCount++;
  }
  const updatedProfile: ProfileData = { ...profile, avatarImage };

  // Career items
  const updatedCareer = careerItems.map((item, idx) => {
    const candidate =
      vault[`career:${item.id}`] ||
      vault[item.id] ||
      vault[`career:${item.company.toLowerCase().trim()}`] ||
      vault[`career:index:${idx}`];

    if (candidate && isUserUploadedImage(candidate) && item.image !== candidate) {
      appliedCount++;
      return { ...item, image: candidate };
    }
    return item;
  });

  // Projects
  const updatedProjects = projects.map((proj, idx) => {
    const candidate =
      vault[`project:${proj.id}`] ||
      vault[proj.id] ||
      vault[`project:${proj.title.toLowerCase().trim()}`] ||
      vault[`project:index:${idx}`];

    if (candidate && isUserUploadedImage(candidate) && proj.image !== candidate) {
      appliedCount++;
      return { ...proj, image: candidate };
    }
    return proj;
  });

  // Personal items
  const updatedPersonal = personalItems.map((item, idx) => {
    const candidate =
      vault[`personal:${item.id}`] ||
      vault[item.id] ||
      vault[`personal:${item.title.toLowerCase().trim()}`] ||
      vault[`personal:index:${idx}`];

    if (candidate && isUserUploadedImage(candidate) && item.image !== candidate) {
      appliedCount++;
      return { ...item, image: candidate };
    }
    return item;
  });

  return {
    profile: updatedProfile,
    careerItems: updatedCareer,
    projects: updatedProjects,
    personalItems: updatedPersonal,
    appliedCount
  };
}
