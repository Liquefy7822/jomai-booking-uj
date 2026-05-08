import { courts } from './mockCourts';
import type { Court } from './types';
import { storeCourtData, getCourtData, courtDataExists } from '../blobStorage';

// Mock Courts Data - Badminton only

// In-memory cache for courts
let cachedCourts: any[] = courts;

// Initialize court data from blob storage
async function initializeCourtData() {
  try {
    const exists = await courtDataExists();
    if (exists) {
      const blobData = await getCourtData();
      if (blobData && blobData.courts) {
        cachedCourts = blobData.courts;
        console.log('Court data loaded from blob storage');
      }
    } else {
      // Initialize blob storage with default data
      await storeCourtData(courts);
      console.log('Court data initialized in blob storage');
    }
  } catch (error) {
    console.error('Error initializing court data:', error);
    // Fallback to mock data
    cachedCourts = courts;
  }
}

// Helper functions
export const getCourtById = (id: string): Court | undefined =>
  cachedCourts.find((c) => c.id === id);

export const getAllCourts = (): any[] => cachedCourts;

export const updateCourt = async (updatedCourt: any): Promise<void> => {
  const index = cachedCourts.findIndex(c => c.id === updatedCourt.id);
  if (index !== -1) {
    cachedCourts[index] = updatedCourt;
    await storeCourtData(cachedCourts);
    console.log(`Court ${updatedCourt.id} updated and saved to blob storage`);
  }
};

export const addCourt = async (newCourt: any): Promise<void> => {
  cachedCourts.push(newCourt);
  await storeCourtData(cachedCourts);
  console.log(`New court ${newCourt.id} added and saved to blob storage`);
};

export const deleteCourt = async (courtId: string): Promise<void> => {
  const index = cachedCourts.findIndex(c => c.id === courtId);
  if (index !== -1) {
    cachedCourts.splice(index, 1);
    await storeCourtData(cachedCourts);
    console.log(`Court ${courtId} deleted and saved to blob storage`);
  }
};

// Initialize court data on module load
initializeCourtData();

// Export the cached courts (for backward compatibility)
export { cachedCourts as courts };
