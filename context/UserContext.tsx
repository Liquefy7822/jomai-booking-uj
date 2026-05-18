"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/lib/data/types";
import { getSingpassPersona } from "@/lib/data/singpassPersonas";
import { 
  authenticateUser, 
  authenticateSingpassUser,
  createUser, 
  updateUserProfile, 
  changeUserPassword,
  userAccountsExist,
  createSession,
  validateSession,
  removeSession,
  removeAllUserSessions,
  cleanupExpiredSessions,
  type UserAccount 
} from "@/lib/userStorage";

interface UserContextType {
  user: User | null;
  loginWithSingpass: (personaId: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  logoutAllDevices: () => Promise<boolean>;
  updateProfile: (updates: { name?: string; profilePicture?: string }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user accounts and validate session on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Clean up expired sessions
        await cleanupExpiredSessions();

        // Check if user accounts exist, if not create default admin
        const accountsExist = await userAccountsExist();
        if (!accountsExist) {
          console.log('No user accounts found, initializing with default data...');
          // This would be handled by a migration script in production
        }

        // Load session from localStorage
        const sessionToken = localStorage.getItem("bookit-session");
        if (sessionToken) {
          // Validate session and get user
          const authenticatedUser = await validateSession(sessionToken);
          if (authenticatedUser) {
            const prefsRaw = localStorage.getItem(
              `bookit-prefs-${authenticatedUser.id}`,
            );
            const userForContext: User = {
              id: authenticatedUser.id,
              email: authenticatedUser.email,
              name: authenticatedUser.name,
              priorityScore: authenticatedUser.priorityScore,
              createdAt: authenticatedUser.createdAt,
              profilePicture: authenticatedUser.profilePicture,
              bookingPreferences: prefsRaw
                ? JSON.parse(prefsRaw)
                : undefined,
            };
            setUser(userForContext);
          } else {
            // Invalid session, remove it
            localStorage.removeItem("bookit-session");
          }
        }
      } catch (err) {
        console.error('Error initializing user context:', err);
        setError('Failed to initialize user system');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loginWithSingpass = async (personaId: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const persona = getSingpassPersona(personaId);
      if (!persona) {
        setError("Invalid demo profile");
        return false;
      }

      const authenticatedUser = await authenticateSingpassUser(
        persona.nric,
        persona.name,
      );

      const session = await createSession(
        authenticatedUser.id,
        navigator.userAgent,
      );

      const bookingPreferences = {
        preferredSchedule: persona.preferredSchedule,
        maxPricePerHour: persona.maxPricePerHour,
        scheduleLabel: persona.scheduleLabel,
      };

      localStorage.setItem(
        `bookit-prefs-${authenticatedUser.id}`,
        JSON.stringify(bookingPreferences),
      );

      const userForContext: User = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        priorityScore: authenticatedUser.priorityScore,
        createdAt: authenticatedUser.createdAt,
        profilePicture: authenticatedUser.profilePicture,
        nric: persona.nric,
        bookingPreferences,
      };

      setUser(userForContext);
      localStorage.setItem("bookit-session", session.token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Singpass login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const authenticatedUser = await authenticateUser(email, password);
      if (authenticatedUser) {
        // Create session for cross-device access
        const session = await createSession(authenticatedUser.id, navigator.userAgent);
        
        const userForContext: User = {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          name: authenticatedUser.name,
          priorityScore: authenticatedUser.priorityScore,
          createdAt: authenticatedUser.createdAt,
          profilePicture: authenticatedUser.profilePicture,
        };
        
        setUser(userForContext);
        localStorage.setItem("bookit-session", session.token);
        return true;
      }
      
      setError('Invalid email or password');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const newUser = await createUser({ email, name, password });
      
      // Create session for new user
      const session = await createSession(newUser.id, navigator.userAgent);
      
      const userForContext: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        priorityScore: newUser.priorityScore,
        createdAt: newUser.createdAt,
        profilePicture: newUser.profilePicture,
      };
      
      setUser(userForContext);
      localStorage.setItem("bookit-session", session.token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: { name?: string; profilePicture?: string }): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const updatedUser = await updateUserProfile(user.id, updates);
      if (updatedUser) {
        const userForContext: User = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          priorityScore: updatedUser.priorityScore,
          createdAt: updatedUser.createdAt,
          profilePicture: updatedUser.profilePicture,
        };
        
        setUser(userForContext);
        return true;
      }
      
      setError('Failed to update profile');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const success = await changeUserPassword(user.id, currentPassword, newPassword);
      if (!success) {
        setError('Current password is incorrect');
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Remove current session
      const sessionToken = localStorage.getItem("bookit-session");
      if (sessionToken) {
        const session = await validateSession(sessionToken);
        if (session) {
          await removeSession(session.id);
        }
      }
    } catch (err) {
      console.error('Error removing session:', err);
    } finally {
      setUser(null);
      setError(null);
      localStorage.removeItem("bookit-session");
    }
  };

  const logoutAllDevices = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setError(null);
      const success = await removeAllUserSessions(user.id);
      
      if (success) {
        setUser(null);
        setError(null);
        localStorage.removeItem("bookit-session");
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout from all devices');
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loginWithSingpass,
      login, 
      register, 
      logout, 
      logoutAllDevices,
      updateProfile,
      changePassword,
      isLoading, 
      error 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
