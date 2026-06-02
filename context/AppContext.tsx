"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

// ==========================================
// 1. DATA TYPES
// ==========================================

export interface AppraisedDevice {
  id: string;
  name: string;
  status: "Scanning" | "Refurbished" | "Harvested" | "Recycled" | "Resale";
  grade: string;
  payout: number;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  payouts: number;
  carbonAverted: number;
  devicesAppraisedCount: number;
  devicesList: AppraisedDevice[];
  avatarUrl?: string;
}

export interface BasketItem {
  id: string;
  title: string;
  price: number;
  type: string;
  role: string;
  quantity: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  addAppraisedDevice: (device: Omit<AppraisedDevice, "id" | "date">) => void;
}

interface BasketContextType {
  items: BasketItem[];
  addItem: (product: { title: string; price: string | number; type: string; role: string }) => void;
  removeItem: (id: string) => void;
  clearBasket: () => void;
  totalPrice: number;
  checkout: () => Promise<boolean>;
}

// ==========================================
// 2. CONTEXT DECLARATIONS
// ==========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Default initial user data
const DEFAULT_USER: UserProfile = {
  name: "Sayan Das",
  email: "sayan@ecoloop.ai",
  payouts: 850.00,
  carbonAverted: 420.5,
  devicesAppraisedCount: 3,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  devicesList: [
    {
      id: "EL-9821",
      name: "iPhone 13 Pro",
      status: "Refurbished",
      grade: "Grade B",
      payout: 340.00,
      date: "2026-05-18",
    },
    {
      id: "EL-4482",
      name: "MacBook Air M1",
      status: "Harvested",
      grade: "Grade C",
      payout: 510.00,
      date: "2026-05-25",
    },
    {
      id: "EL-1093",
      name: "iPad Pro 11-inch",
      status: "Recycled",
      grade: "Grade D",
      payout: 0.00,
      date: "2026-05-30",
    }
  ]
};

// ==========================================
// 3. COMBINED PROVIDER COMPONENT
// ==========================================

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [items, setItems] = useState<BasketItem[]>([]);

  // Sync state with NextAuth session
  useEffect(() => {
    if (status === "loading") {
      setAuthLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      const email = session.user.email || "";
      const existingData = localStorage.getItem(`ecoloop_user_${email}`);

      let loggedInUser: UserProfile;
      if (existingData) {
        loggedInUser = JSON.parse(existingData);
      } else {
        // Fallback to default user if they log in with the exact default email
        if (email === "sayan@ecoloop.ai") {
          loggedInUser = DEFAULT_USER;
        } else {
          loggedInUser = {
            name: session.user.name || email.split("@")[0].replace(/[._]/g, " "),
            email: email,
            payouts: 0.00,
            carbonAverted: 0.0,
            devicesAppraisedCount: 0,
            devicesList: [],
            avatarUrl: session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
          };
        }
        localStorage.setItem(`ecoloop_user_${email}`, JSON.stringify(loggedInUser));
      }

      setUser(loggedInUser);
      setIsAuthenticated(true);
      setAuthLoading(false);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  }, [session, status]);

  // Load basket states on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBasket = localStorage.getItem("ecoloop_basket");
      if (storedBasket) {
        setItems(JSON.parse(storedBasket));
      }
    }
  }, []);

  // Save states on updates
  const saveUser = (newUser: UserProfile | null, authState: boolean) => {
    setUser(newUser);
    setIsAuthenticated(authState);
    if (typeof window !== "undefined" && newUser) {
      localStorage.setItem(`ecoloop_user_${newUser.email}`, JSON.stringify(newUser));
    }
  };

  const saveBasket = (newItems: BasketItem[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecoloop_basket", JSON.stringify(newItems));
    }
  };

  // ==========================================
  // AUTH ROUTINES
  // ==========================================

  const login = async (email: string, name?: string): Promise<boolean> => {
    setAuthLoading(true);

    // Check if registry record exists, if not initialize it
    const existingData = localStorage.getItem(`ecoloop_user_${email}`);
    if (!existingData) {
      const initialUser: UserProfile = {
        name: name || email.split("@")[0].replace(/[._]/g, " "),
        email: email,
        payouts: 0.00,
        carbonAverted: 0.0,
        devicesAppraisedCount: 0,
        devicesList: [],
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      };
      localStorage.setItem(`ecoloop_user_${email}`, JSON.stringify(initialUser));
    }

    // Call NextAuth signIn credentials provider
    const result = await nextAuthSignIn("credentials", {
      email,
      password: "password123", // simulated password satisfying credentials check
      redirect: false
    });

    if (result?.error) {
      setAuthLoading(false);
      return false;
    }

    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    setAuthLoading(true);

    const newUser: UserProfile = {
      name,
      email,
      payouts: 0.00,
      carbonAverted: 0.0,
      devicesAppraisedCount: 0,
      devicesList: [],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
    };

    // Save in general registry before logging in
    if (typeof window !== "undefined") {
      localStorage.setItem(`ecoloop_user_${email}`, JSON.stringify(newUser));
    }

    // Sign in the user instantly with NextAuth
    const result = await nextAuthSignIn("credentials", {
      email,
      password: "password123",
      redirect: false
    });

    if (result?.error) {
      setAuthLoading(false);
      return false;
    }

    return true;
  };

  const logout = async () => {
    if (user && typeof window !== "undefined") {
      localStorage.setItem(`ecoloop_user_${user.email}`, JSON.stringify(user));
    }
    await nextAuthSignOut({ redirect: false });
  };

  const updateProfile = (name: string, email: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, email };
    saveUser(updatedUser, isAuthenticated);
  };

  const addAppraisedDevice = (device: Omit<AppraisedDevice, "id" | "date">) => {
    if (!user) return;
    const trackingId = `EL-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split("T")[0];

    const newDevice: AppraisedDevice = {
      ...device,
      id: trackingId,
      date: today
    };

    const updatedList = [newDevice, ...user.devicesList];
    const newPayouts = user.payouts + device.payout;
    // Each processed device saves on average 140kg CO2 circular carbon equivalent
    const newCarbon = user.carbonAverted + (device.payout > 0 ? 140.2 : 45.6);

    const updatedUser: UserProfile = {
      ...user,
      devicesList: updatedList,
      devicesAppraisedCount: updatedList.length,
      payouts: parseFloat(newPayouts.toFixed(2)),
      carbonAverted: parseFloat(newCarbon.toFixed(2))
    };

    saveUser(updatedUser, isAuthenticated);
  };

  // ==========================================
  // BASKET ROUTINES
  // ==========================================

  const addItem = (product: { title: string; price: string | number; type: string; role: string }) => {
    // Parse price value (e.g. "$649" -> 649)
    const numericPrice = typeof product.price === "number"
      ? product.price
      : parseInt(product.price.toString().replace(/[^0-9]/g, "")) || 0;

    const itemId = product.title.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const existingIndex = items.findIndex((item) => item.id === itemId);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      saveBasket(updated);
    } else {
      const newItem: BasketItem = {
        id: itemId,
        title: product.title,
        price: numericPrice,
        type: product.type,
        role: product.role,
        quantity: 1
      };
      saveBasket([...items, newItem]);
    }
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveBasket(updated);
  };

  const clearBasket = () => {
    saveBasket([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async (): Promise<boolean> => {
    if (items.length === 0) return false;
    // Simulate transaction processing loader
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clearBasket();
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: authLoading,
        login,
        signup,
        logout,
        updateProfile,
        addAppraisedDevice
      }}
    >
      <BasketContext.Provider
        value={{
          items,
          addItem,
          removeItem,
          clearBasket,
          totalPrice,
          checkout
        }}
      >
        {children}
      </BasketContext.Provider>
    </AuthContext.Provider>
  );
}

// ==========================================
// 4. CUSTOM CONSUMER HOOKS
// ==========================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AppContextProvider");
  }
  return context;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within an AppContextProvider");
  }
  return context;
}
