/**
 * Session cleanup utility for maintaining healthy session storage
 * This can be called periodically or on app initialization
 */

import { cleanupExpiredSessions } from './userStorage';

/**
 * Perform session cleanup and maintenance
 */
export async function performSessionCleanup(): Promise<void> {
  try {
    const expiredCount = await cleanupExpiredSessions();
    
    if (expiredCount > 0) {
      console.log(`Cleaned up ${expiredCount} expired sessions`);
    }
  } catch (error) {
    console.error('Error during session cleanup:', error);
  }
}

/**
 * Setup periodic session cleanup (run every hour)
 */
export function setupPeriodicCleanup(): ReturnType<typeof setInterval> {
  return setInterval(async () => {
    await performSessionCleanup();
  }, 60 * 60 * 1000); // 1 hour
}

/**
 * Cleanup sessions on app startup
 */
export async function startupCleanup(): Promise<void> {
  console.log('Performing startup session cleanup...');
  await performSessionCleanup();
  console.log('Startup session cleanup completed');
}
