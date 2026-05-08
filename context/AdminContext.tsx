"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUser {
  email: string;
  username: string;
  isAuthenticated: boolean;
}

interface AdminContextType {
  admin: AdminUser | null;
  login: (email: string, username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session in localStorage
    const savedAdmin = localStorage.getItem("adminSession");
    if (savedAdmin) {
      try {
        const parsedAdmin = JSON.parse(savedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error("Failed to parse admin session:", error);
        localStorage.removeItem("adminSession");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, username: string, password: string): boolean => {
    // Simple authentication check
    if (email === "admin@admin" && username === "admin" && password === "admin") {
      const adminUser: AdminUser = {
        email,
        username,
        isAuthenticated: true,
      };
      setAdmin(adminUser);
      localStorage.setItem("adminSession", JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("adminSession");
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
