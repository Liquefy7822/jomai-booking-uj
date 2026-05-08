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
  login: (email: string, name: string, password?: string) => void;
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

  const login = (email: string, name: string, password?: string) => {
    // TODO: Replace with real API call to authenticate user
    
    // Check for admin credentials
    const isAdmin = 
      name.toLowerCase() === "admin" && 
      email.toLowerCase() === "admin@admin" && 
      password === "admin";
    
    const newUser: User = {
      id: isAdmin ? "admin-1" : `user-${Date.now()}`,
      email,
      name: isAdmin ? "Administrator" : name,
      priorityScore: isAdmin ? 100 : Math.floor(Math.random() * 30) + 70,
      createdAt: new Date().toISOString(),
      isAdmin,
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
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
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
