import { courts } from './mockCourts.js';
import type { Court } from './types';

// Mock Courts Data - Badminton only
export { courts };

// Helper functions
export const getCourtById = (id: string): Court | undefined =>
  courts.find((c) => c.id === id);
