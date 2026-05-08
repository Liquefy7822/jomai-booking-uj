// Client-side compatible implementation using localStorage
// Note: This uses localStorage for client-side compatibility

// Blob storage configuration
const BLOB_BASE_URL = 'https://1u04yecpbxvg7hve.private.blob.vercel-storage.com';

// Court data blob key
const COURTS_BLOB_KEY = 'courts-data.json';

export interface CourtBlobData {
  courts: any[];
  lastUpdated: string;
  version: string;
}

/**
 * Store court data in localStorage
 */
export async function storeCourtData(courts: any[]): Promise<{ url: string }> {
  const data: CourtBlobData = {
    courts,
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };

  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(COURTS_BLOB_KEY, JSON.stringify(data));
    }
    return { url: `${BLOB_BASE_URL}/${COURTS_BLOB_KEY}` };
  } catch (error) {
    console.error('Error storing court data:', error);
    throw error;
  }
}

/**
 * Retrieve court data from localStorage
 */
export async function getCourtData(): Promise<CourtBlobData | null> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(COURTS_BLOB_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data;
      }
    }

    console.log('No court data found in localStorage, using default data');
    return null;
  } catch (error) {
    console.error('Error fetching court data:', error);
    return null;
  }
}

/**
 * Check if court data exists in localStorage
 */
export async function courtDataExists(): Promise<boolean> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(COURTS_BLOB_KEY);
      return !!stored;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Delete court data from localStorage
 */
export async function deleteCourtData(): Promise<boolean> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(COURTS_BLOB_KEY);
    }
    return true;
  } catch (error) {
    console.error('Error deleting court data:', error);
    return false;
  }
}

/**
 * List all storage keys (client-side equivalent)
 */
export async function listBlobs(): Promise<string[]> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.includes('-data.json'));
    }
    return [];
  } catch (error) {
    console.error('Error listing storage keys:', error);
    return [];
  }
}
