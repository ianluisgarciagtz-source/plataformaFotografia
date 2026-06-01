import React, { createContext, useContext, useState, ReactNode } from "react";
import { Photographer, PHOTOGRAPHERS } from "../data/mockData";

export type UserRole = "photographer" | "client" | "admin" | null;

export interface PhotographerProfile {
  city: string;
  phone: string;
  bio: string;
  specialties: string[];
  experience: string;
  priceFrom: number;
  instagram?: string;
  coverPhoto?: string;
}

export interface ActiveSubscription {
  planId: "basic" | "pro" | "premium";
  planName: string;
  billing: "monthly" | "annual";
  price: number;
  activatedAt: string;
  renewsAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hasSubscription?: boolean;
}

interface PhotographerRegistrationData {
  city: string;
  phone: string;
  specialties: string[];
  bio: string;
  experience: string;
  priceFrom: number;
  instagram?: string;
}

interface AuthContextType {
  user: User | null;
  photographerProfile: PhotographerProfile | null;
  subscription: ActiveSubscription | null;
  registeredPhotographers: Photographer[];
  login: (email: string, password: string, role: UserRole, registrationData?: PhotographerRegistrationData) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User & PhotographerProfile>) => void;
  activateSubscription: (planId: string, billing: "monthly" | "annual") => void;
  registerPhotographer: (profile: Photographer) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: "admin@fototrabajo.mx",
  password: "FotoAdmin2024!",
};

const PLAN_DATA: Record<string, { name: string; monthly: number; annual: number }> = {
  basic:   { name: "Básico",  monthly: 80,  annual: 64 },
  pro:     { name: "Pro",     monthly: 160, annual: 128 },
  premium: { name: "Premium", monthly: 220, annual: 176 },
};

function makeRenewDate(billing: "monthly" | "annual"): string {
  const d = new Date();
  if (billing === "annual") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

const MOCK_USERS: Record<string, { user: User; password: string }> = {
  "fotografo@fototrabajo.mx": {
    password: "foto123",
    user: {
      id: "p1",
      name: "Carlos Ruiz",
      email: "fotografo@fototrabajo.mx",
      role: "photographer",
      avatar: "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=150&h=150&fit=crop",
      hasSubscription: true,
    },
  },
  "cliente@fototrabajo.mx": {
    password: "cliente123",
    user: {
      id: "c1",
      name: "Ana García",
      email: "cliente@fototrabajo.mx",
      role: "client",
      avatar: "https://images.unsplash.com/photo-1773336099065-57893268749f?w=150&h=150&fit=crop",
      hasSubscription: false,
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [photographerProfile, setPhotographerProfile] = useState<PhotographerProfile | null>(null);
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [registeredPhotographers, setRegisteredPhotographers] = useState<Photographer[]>(PHOTOGRAPHERS);

  const registerPhotographer = (profile: Photographer) => {
    setRegisteredPhotographers((prev) => [profile, ...prev]);
  };

  const login = (email: string, password: string, role: UserRole, registrationData?: PhotographerRegistrationData): boolean => {
    if (role === "admin") {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        setUser({ id: "admin-1", name: "Administrador", email: ADMIN_CREDENTIALS.email, role: "admin" });
        return true;
      }
      return false;
    }

    const found = MOCK_USERS[email];
    if (found && found.user.role === role) {
      setUser(found.user);
      if (role === "photographer") {
        setPhotographerProfile({
          city: "CDMX",
          phone: "+52 55 1234 5678",
          bio: "Fotógrafo profesional con más de 10 años de experiencia.",
          specialties: ["Bodas", "Retratos", "Eventos"],
          experience: "10+",
          priceFrom: 1500,
          instagram: "@carlosruizfoto",
        });
      }
      return true;
    }

    if (!found) {
      const newUser: User = {
        id: "user-" + Date.now(),
        name: role === "photographer" ? "Mi Nombre" : "Cliente",
        email,
        role,
        hasSubscription: false,
      };
      setUser(newUser);

      if (role === "photographer") {
        const profile: PhotographerProfile = {
          city: registrationData?.city || "Mi ciudad",
          phone: registrationData?.phone || "",
          bio: registrationData?.bio || "Fotógrafo profesional disponible para nuevas oportunidades.",
          specialties: registrationData?.specialties && registrationData?.specialties.length > 0 ? registrationData.specialties : ["Fotografía general"],
          experience: registrationData?.experience || "1",
          priceFrom: registrationData?.priceFrom || 0,
          instagram: registrationData?.instagram || "",
        };
        setPhotographerProfile(profile);

        const newPhotographer: Photographer = {
          id: newUser.id,
          name: newUser.name,
          avatar: "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=200&h=200&fit=crop&crop=face",
          coverPhoto: "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=1200&h=500&fit=crop",
          city: profile.city,
          country: "México",
          distance: 0.1,
          rating: 0,
          reviewCount: 0,
          specialties: profile.specialties,
          priceFrom: profile.priceFrom,
          bio: profile.bio,
          portfolio: [],
          reviews: [],
          verified: false,
          responseTime: "< 24 horas",
          yearsExperience: parseInt(profile.experience) || 1,
          instagram: profile.instagram || undefined,
          lat: 19.4326,
          lng: -99.1332,
        };
        registerPhotographer(newPhotographer);
      }
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setPhotographerProfile(null);
    setSubscription(null);
  };

  const updateProfile = (data: Partial<User & PhotographerProfile>) => {
    if (data.name || data.email || data.avatar) {
      setUser((prev) => prev ? { ...prev, ...data } : prev);
    }
    setPhotographerProfile((prev) =>
      prev
        ? {
            ...prev,
            city: data.city ?? prev.city,
            phone: data.phone ?? prev.phone,
            bio: data.bio ?? prev.bio,
            specialties: data.specialties ?? prev.specialties,
            experience: data.experience ?? prev.experience,
            priceFrom: data.priceFrom ?? prev.priceFrom,
            instagram: data.instagram ?? prev.instagram,
            coverPhoto: data.coverPhoto ?? prev.coverPhoto,
          }
        : prev
    );
  };

  const activateSubscription = (planId: string, billing: "monthly" | "annual") => {
    const plan = PLAN_DATA[planId];
    if (!plan) return;
    setSubscription({
      planId: planId as ActiveSubscription["planId"],
      planName: plan.name,
      billing,
      price: billing === "monthly" ? plan.monthly : plan.annual,
      activatedAt: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }),
      renewsAt: makeRenewDate(billing),
    });
    setUser((prev) => prev ? { ...prev, hasSubscription: true } : prev);
  };

  return (
    <AuthContext.Provider value={{
      user, photographerProfile, subscription, registeredPhotographers,
      login, logout, updateProfile, activateSubscription, registerPhotographer,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
