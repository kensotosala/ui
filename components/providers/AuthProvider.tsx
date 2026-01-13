"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  authService,
  UserData,
  LoginCredentials,
} from "@/app/features/auth/services/authService";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkRole: (role: string) => boolean;
  checkAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe ser usado dentro de AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Función mejorada para validar y cargar usuario
  const loadUserFromToken = useCallback(() => {
    const token = authService.getToken();

    // Validación explícita: debe existir token Y ser válido
    if (!token) {
      setUser(null);
      return false;
    }

    if (!authService.isAuthenticated()) {
      setUser(null);
      authService.logout(); // Limpia token inválido
      return false;
    }

    const userData = authService.decodeJWT(token);
    if (!userData) {
      setUser(null);
      authService.logout(); // Limpia token corrupto
      return false;
    }

    setUser(userData);
    return true;
  }, []);

  // Inicialización
  useEffect(() => {
    const initializeAuth = () => {
      const hasValidAuth = loadUserFromToken();
      setIsLoading(false);

      // Redirigir inmediatamente si no hay autenticación válida
      if (!hasValidAuth && !PUBLIC_ROUTES.includes(pathname || "")) {
        router.replace("/login");
      }
    };

    initializeAuth();
  }, [loadUserFromToken, pathname, router]);

  // Sincronización entre pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Solo reaccionar si cambió el token
      if (e.key === "authToken" || e.key === null) {
        const hasValidAuth = loadUserFromToken();

        // Si se eliminó el token, redirigir a login
        if (!hasValidAuth && !PUBLIC_ROUTES.includes(pathname || "")) {
          router.replace("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken, pathname, router]);

  // Protección de rutas - useEffect separado y simplificado
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`)
    );

    const token = authService.getToken();
    const isValidAuth = token && authService.isAuthenticated();

    // Caso 1: Ruta privada sin autenticación válida -> Login
    if (!isPublicRoute && !isValidAuth) {
      router.replace("/login");
      return;
    }

    // Caso 2: Usuario autenticado en página de login -> Dashboard
    if (pathname === "/login" && isValidAuth) {
      router.replace("/");
      return;
    }
  }, [pathname, isLoading, router, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      await authService.login(credentials);
      const success = loadUserFromToken();

      if (success) {
        router.replace("/");
      } else {
        throw new Error("Error al cargar datos del usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    router.replace("/login");
    setIsLoading(false);
  };

  const checkRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const checkAnyRole = (roles: string[]): boolean => {
    return user?.roles.some((role) => roles.includes(role)) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!authService.getToken(),
        isLoading,
        login,
        logout,
        checkRole,
        checkAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
