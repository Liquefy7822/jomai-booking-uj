import { put, list, head, del } from "@vercel/blob";
import crypto from 'crypto';

// Blob storage configuration
const BLOB_STORE_ID = process.env.NEXT_PUBLIC_BLOB_STORE_ID || 'store_1u04yEcpbxVg7hVe';
const BLOB_REGION = process.env.NEXT_PUBLIC_BLOB_REGION || 'sin1';
const BLOB_BASE_URL = process.env.NEXT_PUBLIC_BLOB_BASE_URL || 'https://1u04yecpbxvg7hve.private.blob.vercel-storage.com';

// User accounts blob key
const USERS_BLOB_KEY = 'user-accounts.json';

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

/**
 * Hash password using SHA-256
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
}

/**
 * Store user accounts in Vercel Blob storage
 */
export async function storeUserAccounts(users: UserAccount[]): Promise<{ url: string }> {
  const data: UserBlobData = {
    users,
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };

  const blob = await put(USERS_BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
  });

  return blob;
}

/**
 * Retrieve user accounts from Vercel Blob storage
 */
export async function getUserAccounts(): Promise<UserAccount[]> {
  try {
    const response = await fetch(`${BLOB_BASE_URL}/${USERS_BLOB_KEY}`);
    
    if (!response.ok) {
      console.log('No user accounts found in blob storage, returning empty array');
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching user accounts from blob storage:', error);
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
 * Check if user accounts exist in blob storage
 */
export async function userAccountsExist(): Promise<boolean> {
  try {
    const response = await head(USERS_BLOB_KEY);
    return !!response;
  } catch (error) {
    return false;
  }
}
