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
  role: "buyer" | "seller";
  plan: "free" | "pro" | "smart";
  wishlist: string[];
  bankDetails?: {
    accountHolder: string;
    bankName: string;
    accountNum: string;
    ifsc: string;
  };
  listedProducts: any[];
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
  login: (email: string, password?: string, role?: "buyer" | "seller") => Promise<boolean>;
  signup: (name: string, email: string, password?: string, role?: "buyer" | "seller") => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  addAppraisedDevice: (device: Omit<AppraisedDevice, "id" | "date">) => void;
  toggleWishlist: (productId: string) => void;
  upgradePlan: (plan: "free" | "pro" | "smart") => void;
  updateBankDetails: (bankDetails: { accountHolder: string; bankName: string; accountNum: string; ifsc: string }) => void;
  listProduct: (product: any) => void;
  chatMessages: { [chatId: string]: any[] };
  sendMessage: (sender: string, receiver: string, text: string) => void;
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
      setAuthLoading(true);

      // Fetch user profile from Neon DB via API
      fetch(`/api/user/profile?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            const pendingRole = typeof window !== "undefined" ? localStorage.getItem("ecoloop_oauth_role") : null;
            if (pendingRole && (pendingRole === "buyer" || pendingRole === "seller") && data.role !== pendingRole) {
              // Sync role selection from social login to DB
              fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, role: pendingRole })
              })
              .then(() => {
                setUser({ ...data, role: pendingRole as "buyer" | "seller" });
                setIsAuthenticated(true);
                if (typeof window !== "undefined") {
                  localStorage.removeItem("ecoloop_oauth_role");
                }
              })
              .catch((err) => {
                console.error("Error updating profile role:", err);
                setUser(data);
                setIsAuthenticated(true);
              });
            } else {
              setUser(data);
              setIsAuthenticated(true);
              if (typeof window !== "undefined") {
                localStorage.removeItem("ecoloop_oauth_role");
              }
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setAuthLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          setUser(null);
          setIsAuthenticated(false);
          setAuthLoading(false);
        });

      // Fetch chats from Neon DB via API
      fetch(`/api/chats?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.chats) {
            setChatMessages(data.chats);
          }
        })
        .catch((err) => {
          console.error("Error fetching chats:", err);
        });
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

  const login = async (email: string, password?: string, role?: "buyer" | "seller"): Promise<boolean> => {
    setAuthLoading(true);

    // Call NextAuth signIn credentials provider
    const result = await nextAuthSignIn("credentials", {
      email,
      password: password || "password123", // simulated password satisfying credentials check or custom password
      role: role || "buyer",
      callbackUrl: "/dashboard",
      redirect: true
    });

    if (result?.error) {
      setAuthLoading(false);
      return false;
    }

    return true;
  };

  const signup = async (name: string, email: string, password?: string, role?: "buyer" | "seller"): Promise<boolean> => {
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || "password123", role: role || "buyer" })
      });
      const data = await res.json();
      if (data.error) {
        setAuthLoading(false);
        return false;
      }

      // Sign in the user instantly with NextAuth
      const result = await nextAuthSignIn("credentials", {
        email,
        password: password || "password123",
        callbackUrl: "/dashboard",
        redirect: true
      });

      if (result?.error) {
        setAuthLoading(false);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Signup API error:", err);
      setAuthLoading(false);
      return false;
    }
  };

  // ==========================================
  // CHAT MESSAGES STATE
  // ==========================================
  const [chatMessages, setChatMessages] = useState<{ [chatId: string]: any[] }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedChats = localStorage.getItem("ecoloop_chats");
      if (storedChats) {
        setChatMessages(JSON.parse(storedChats));
      }
    }
  }, []);

  const saveChats = (newChats: { [chatId: string]: any[] }) => {
    setChatMessages(newChats);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecoloop_chats", JSON.stringify(newChats));
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, productId })
      });
      const data = await res.json();
      if (data.success && data.wishlist) {
        setUser({ ...user, wishlist: data.wishlist });
      }
    } catch (err) {
      console.error("Wishlist API error:", err);
    }
  };

  const upgradePlan = async (plan: "free" | "pro" | "smart") => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, plan });
      }
    } catch (err) {
      console.error("Plan upgrade API error:", err);
    }
  };

  const updateBankDetails = async (bankDetails: { accountHolder: string; bankName: string; accountNum: string; ifsc: string }) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/bank", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, bankDetails })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, bankDetails });
      }
    } catch (err) {
      console.error("Bank details API error:", err);
    }
  };

  const listProduct = async (product: any) => {
    if (!user) return;
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          price: product.price,
          type: product.type,
          role: product.role,
          specs: product.specs,
          image: product.image,
          sellerEmail: user.email,
          sellerName: user.name
        })
      });
      const data = await res.json();
      if (data.success && data.productId) {
        const newProduct = {
          ...product,
          id: data.productId,
          sellerEmail: user.email,
          sellerName: user.name,
          date: new Date().toISOString().split("T")[0]
        };
        const listedProducts = user.listedProducts || [];
        setUser({ ...user, listedProducts: [newProduct, ...listedProducts] });
      }
    } catch (err) {
      console.error("List product API error:", err);
    }
  };

  const sendMessage = async (sender: string, receiver: string, text: string) => {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, receiver, text })
      });
      const data = await res.json();
      if (data.success && data.messageId) {
        const chatId = [sender, receiver].sort().join("_");
        const existing = chatMessages[chatId] || [];
        const newMessage = {
          id: data.messageId,
          sender,
          receiver,
          text,
          timestamp: data.timestamp
        };
        setChatMessages({ ...chatMessages, [chatId]: [...existing, newMessage] });
      }
    } catch (err) {
      console.error("Send message API error:", err);
    }
  };

  const logout = async () => {
    await nextAuthSignOut({ redirect: false });
  };

  const updateProfile = async (name: string, email: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, name });
      }
    } catch (err) {
      console.error("Update profile API error:", err);
    }
  };

  const addAppraisedDevice = async (device: Omit<AppraisedDevice, "id" | "date">) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, device })
      });
      const data = await res.json();
      if (data.success && data.trackingId) {
        const newDevice: AppraisedDevice = {
          ...device,
          id: data.trackingId,
          date: new Date().toISOString().split("T")[0]
        };
        const updatedList = [newDevice, ...user.devicesList];
        const newPayouts = user.payouts + device.payout;
        const newCarbon = user.carbonAverted + (device.payout > 0 ? 140.2 : 45.6);

        setUser({
          ...user,
          devicesList: updatedList,
          devicesAppraisedCount: updatedList.length,
          payouts: parseFloat(newPayouts.toFixed(2)),
          carbonAverted: parseFloat(newCarbon.toFixed(2))
        });
      }
    } catch (err) {
      console.error("Appraise device API error:", err);
    }
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
        addAppraisedDevice,
        toggleWishlist,
        upgradePlan,
        updateBankDetails,
        listProduct,
        chatMessages,
        sendMessage
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
