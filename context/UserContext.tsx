"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/lib/mockData";

interface UserContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  register: (email: string, name: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // TODO: Replace with real auth check from backend
    const storedUser = localStorage.getItem("bookit-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    // TODO: Replace with real API call to authenticate user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      priorityScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100 for demo
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("bookit-user", JSON.stringify(newUser));
  };

  const register = (email: string, name: string) => {
    // TODO: Replace with real API call to register user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      priorityScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100 for demo
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("bookit-user", JSON.stringify(newUser));
  };

  const logout = () => {
    // TODO: Replace with real API call to invalidate session
    setUser(null);
    localStorage.removeItem("bookit-user");
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, isLoading }}>
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
