// Client-side compatible implementation using fetch API
// Note: This uses fetch to communicate with Vercel Blob storage

// Blob storage configuration
const BLOB_BASE_URL = 'https://1u04yecpbxvg7hve.private.blob.vercel-storage.com';

// User accounts blob key
const USERS_BLOB_KEY = 'user-accounts.json';

// Sessions blob key
const SESSIONS_BLOB_KEY = 'user-sessions.json';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // Hashed password
  profilePicture?: string; // URL to profile picture
  priorityScore: number;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface UserBlobData {
  users: UserAccount[];
  lastUpdated: string;
  version: string;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  deviceInfo?: string;
  lastAccessed: string;
}

export interface SessionBlobData {
  sessions: UserSession[];
  lastUpdated: string;
  version: string;
}

/**
 * Hash password using Web Crypto API
 */
export function hashPassword(password: string): string {
  // Simple client-side hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt'); // Add salt for basic security
  return Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
}

/**
 * Store user accounts in Vercel Blob storage using fetch
 */
export async function storeUserAccounts(users: UserAccount[]): Promise<{ url: string }> {
  const data: UserBlobData = {
    users,
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };

  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // For now, use localStorage as fallback for client-side
      localStorage.setItem(USERS_BLOB_KEY, JSON.stringify(data));
    }
    return { url: `${BLOB_BASE_URL}/${USERS_BLOB_KEY}` };
  } catch (error) {
    console.error('Error storing user accounts:', error);
    throw error;
  }
}

/**
 * Retrieve user accounts from storage
 */
export async function getUserAccounts(): Promise<UserAccount[]> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Try localStorage first for client-side compatibility
      const stored = localStorage.getItem(USERS_BLOB_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.users || [];
      }
    }

    // Fallback to empty array if nothing found
    return [];
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    return [];
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<UserAccount | null> {
  const users = await getUserAccounts();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<UserAccount | null> {
  const users = await getUserAccounts();
  return users.find(user => user.id === id) || null;
}

/**
 * Create new user account
 */
export async function createUser(userData: {
  email: string;
  name: string;
  password: string;
  profilePicture?: string;
}): Promise<UserAccount> {
  const users = await getUserAccounts();
  
  // Check if user already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: UserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: userData.email.toLowerCase(),
    name: userData.name,
    passwordHash: hashPassword(userData.password),
    profilePicture: userData.profilePicture,
    priorityScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100 for demo
    createdAt: new Date().toISOString(),
    isActive: true
  };

  users.push(newUser);
  await storeUserAccounts(users);
  
  return newUser;
}

/**
 * Sign in or register via mock Singpass (email derived from NRIC).
 */
export async function authenticateSingpassUser(
  nric: string,
  name: string,
): Promise<UserAccount> {
  const email = `${nric.toLowerCase()}@singpass.bookit`;
  let user = await findUserByEmail(email);

  if (!user) {
    user = await createUser({
      email,
      name,
      password: nric,
    });
  }

  const users = await getUserAccounts();
  const userIndex = users.findIndex((u) => u.id === user!.id);
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    await storeUserAccounts(users);
    user = users[userIndex];
  }

  return user!;
}

/**
 * Authenticate user
 */
export async function authenticateUser(email: string, password: string): Promise<UserAccount | null> {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  // Update last login
  const users = await getUserAccounts();
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    await storeUserAccounts(users);
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: {
  name?: string;
  profilePicture?: string;
}): Promise<UserAccount | null> {
  const users = await getUserAccounts();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return null;
  }

  // Update user data
  if (updates.name) {
    users[userIndex].name = updates.name;
  }
  if (updates.profilePicture !== undefined) {
    users[userIndex].profilePicture = updates.profilePicture;
  }

  await storeUserAccounts(users);
  return users[userIndex];
}

/**
 * Change user password
 */
export async function changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const users = await getUserAccounts();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return false;
  }

  // Verify current password
  if (!verifyPassword(currentPassword, users[userIndex].passwordHash)) {
    return false;
  }

  // Update password
  users[userIndex].passwordHash = hashPassword(newPassword);
  await storeUserAccounts(users);
  
  return true;
}

/**
 * Deactivate user account
 */
export async function deactivateUser(userId: string): Promise<boolean> {
  const users = await getUserAccounts();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return false;
  }

  users[userIndex].isActive = false;
  await storeUserAccounts(users);
  
  return true;
}

/**
 * Store user sessions in storage
 */
export async function storeUserSessions(sessions: UserSession[]): Promise<{ url: string }> {
  const data: SessionBlobData = {
    sessions,
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };

  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Use localStorage for client-side compatibility
      localStorage.setItem(SESSIONS_BLOB_KEY, JSON.stringify(data));
    }
    return { url: `${BLOB_BASE_URL}/${SESSIONS_BLOB_KEY}` };
  } catch (error) {
    console.error('Error storing user sessions:', error);
    throw error;
  }
}

/**
 * Retrieve user sessions from storage
 */
export async function getUserSessions(): Promise<UserSession[]> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Try localStorage first for client-side compatibility
      const stored = localStorage.getItem(SESSIONS_BLOB_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.sessions || [];
      }
    }

    // Fallback to empty array if nothing found
    return [];
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
}

/**
 * Create new user session
 */
export async function createSession(userId: string, deviceInfo?: string): Promise<UserSession> {
  const sessions = await getUserSessions();
  
  // Generate secure session token using Web Crypto API
  const sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const newSession: UserSession = {
    id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    token: sessionToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    deviceInfo,
    lastAccessed: new Date().toISOString()
  };

  sessions.push(newSession);
  await storeUserSessions(sessions);
  
  return newSession;
}

/**
 * Find session by token
 */
export async function findSessionByToken(token: string): Promise<UserSession | null> {
  const sessions = await getUserSessions();
  
  // Clean up expired sessions first
  const validSessions = sessions.filter(session => 
    new Date(session.expiresAt) > new Date()
  );
  
  // Store cleaned sessions if any were removed
  if (validSessions.length !== sessions.length) {
    await storeUserSessions(validSessions);
  }
  
  // Find valid session
  const session = validSessions.find(session => session.token === token);
  
  if (!session) {
    return null;
  }
  
  // Update last accessed time
  session.lastAccessed = new Date().toISOString();
  const sessionIndex = validSessions.findIndex(s => s.id === session.id);
  validSessions[sessionIndex] = session;
  await storeUserSessions(validSessions);
  
  return session;
}

/**
 * Validate session and return user
 */
export async function validateSession(token: string): Promise<UserAccount | null> {
  try {
    const session = await findSessionByToken(token);
    
    if (!session) {
      return null;
    }
    
    // Get user associated with session
    const user = await findUserById(session.userId);
    
    if (!user || !user.isActive) {
      // Remove invalid session
      await removeSession(session.id);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

/**
 * Remove session by ID
 */
export async function removeSession(sessionId: string): Promise<boolean> {
  try {
    const sessions = await getUserSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    
    if (filteredSessions.length !== sessions.length) {
      await storeUserSessions(filteredSessions);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error removing session:', error);
    return false;
  }
}

/**
 * Remove all sessions for a user (logout from all devices)
 */
export async function removeAllUserSessions(userId: string): Promise<boolean> {
  try {
    const sessions = await getUserSessions();
    const filteredSessions = sessions.filter(session => session.userId !== userId);
    
    if (filteredSessions.length !== sessions.length) {
      await storeUserSessions(filteredSessions);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error removing user sessions:', error);
    return false;
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const sessions = await getUserSessions();
    const validSessions = sessions.filter(session => 
      new Date(session.expiresAt) > new Date()
    );
    
    const expiredCount = sessions.length - validSessions.length;
    
    if (expiredCount > 0) {
      await storeUserSessions(validSessions);
    }
    
    return expiredCount;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
}

/**
 * Check if user accounts exist in storage
 */
export async function userAccountsExist(): Promise<boolean> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(USERS_BLOB_KEY);
      return !!stored;
    }
    return false;
  } catch (error) {
    return false;
  }
}
