import { put, list, head, del } from "@vercel/blob";

// Blob storage configuration
const BLOB_STORE_ID = process.env.NEXT_PUBLIC_BLOB_STORE_ID || 'store_1u04yEcpbxVg7hVe';
const BLOB_REGION = process.env.NEXT_PUBLIC_BLOB_REGION || 'sin1';
const BLOB_BASE_URL = process.env.NEXT_PUBLIC_BLOB_BASE_URL || 'https://1u04yecpbxvg7hve.private.blob.vercel-storage.com';

// Court data blob key
const COURTS_BLOB_KEY = 'courts-data.json';

export interface CourtBlobData {
  courts: any[];
  lastUpdated: string;
  version: string;
}

/**
 * Store court data in Vercel Blob storage
 */
export async function storeCourtData(courts: any[]): Promise<{ url: string }> {
  const data: CourtBlobData = {
    courts,
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };

  const blob = await put(COURTS_BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
  });

  return blob;
}

/**
 * Retrieve court data from Vercel Blob storage
 */
export async function getCourtData(): Promise<CourtBlobData | null> {
  try {
    const response = await fetch(`${BLOB_BASE_URL}/${COURTS_BLOB_KEY}`);
    
    if (!response.ok) {
      console.log('No court data found in blob storage, using default data');
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching court data from blob storage:', error);
    return null;
  }
}

/**
 * Check if court data exists in blob storage
 */
export async function courtDataExists(): Promise<boolean> {
  try {
    const response = await head(COURTS_BLOB_KEY);
    return !!response;
  } catch (error) {
    return false;
  }
}

/**
 * Delete court data from blob storage
 */
export async function deleteCourtData(): Promise<void> {
  try {
    await del(COURTS_BLOB_KEY);
    console.log('Court data deleted from blob storage');
  } catch (error) {
    console.error('Error deleting court data:', error);
    throw error;
  }
}

/**
 * List all blobs in storage (for admin purposes)
 */
export async function listAllBlobs(): Promise<any[]> {
  try {
    const { blobs } = await list();
    return blobs;
  } catch (error) {
    console.error('Error listing blobs:', error);
    return [];
  }
}
