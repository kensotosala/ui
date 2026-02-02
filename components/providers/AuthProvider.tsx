/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Mapeo de roles del backend a rutas
const ROLE_ROUTES = {
  Administrador: "/admin",
  Supervisor: "/admin",
  Empleado: "/empleado",
  "Recursos Humanos": "/admin",
  Desarrollador: "/admin",
} as const;

// Función helper para obtener la ruta según el rol
const getRouteForRole = (roles: string[]): string => {
  // Prioridad: Administrador > Supervisor > Recursos Humanos > Desarrollador > Empleado
  if (roles.includes("Administrador")) return "/admin";
  if (roles.includes("Supervisor")) return "/admin";
  if (roles.includes("Recursos Humanos")) return "/admin";
  if (roles.includes("Desarrollador")) return "/admin";
  if (roles.includes("Empleado")) return "/empleado";

  // Por defecto, ir a empleado
  return "/empleado";
};

// Función helper para verificar si el usuario puede acceder a una ruta
const canAccessRoute = (userRoles: string[], pathname: string): boolean => {
  // Las rutas públicas son accesibles para todos
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return true;
  }

  // Si es ruta de admin
  if (pathname.startsWith("/admin")) {
    return userRoles.some((role) =>
      [
        "Administrador",
        "Supervisor",
        "Recursos Humanos",
        "Desarrollador",
      ].includes(role),
    );
  }

  // Si es ruta de empleado
  if (pathname.startsWith("/empleado")) {
    return userRoles.includes("Empleado");
  }

  // Por defecto, permitir acceso
  return true;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUserFromToken = useCallback(() => {
    const token = authService.getToken();

    if (!token) {
      setUser(null);
      return false;
    }

    if (!authService.isAuthenticated()) {
      setUser(null);
      authService.logout();
      return false;
    }

    const userData = authService.decodeJWT(token);
    if (!userData) {
      setUser(null);
      authService.logout();
      return false;
    }

    setUser(userData);
    return true;
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      const hasValidAuth = loadUserFromToken();
      setIsLoading(false);

      if (!hasValidAuth && !PUBLIC_ROUTES.includes(pathname || "")) {
        router.replace("/login");
      }
    };

    initializeAuth();
  }, [loadUserFromToken, pathname, router]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === null) {
        const hasValidAuth = loadUserFromToken();

        if (!hasValidAuth && !PUBLIC_ROUTES.includes(pathname || "")) {
          router.replace("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken, pathname, router]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`),
    );

    const token = authService.getToken();
    const isValidAuth = token && authService.isAuthenticated();

    // Si no está en ruta pública y no está autenticado, redirigir a login
    if (!isPublicRoute && !isValidAuth) {
      router.replace("/login");
      return;
    }

    // Si está en login y ya está autenticado, redirigir según su rol
    if (pathname === "/login" && isValidAuth) {
      const userData = authService.decodeJWT(token!);
      if (userData?.roles && userData.roles.length > 0) {
        const targetRoute = getRouteForRole(userData.roles);
        router.replace(targetRoute);
      }
      return;
    }

    // Verificar acceso a rutas protegidas
    if (isValidAuth && user && user.roles.length > 0) {
      const hasAccess = canAccessRoute(user.roles, pathname || "");

      if (!hasAccess) {
        // Si no tiene acceso, redirigir a su ruta por defecto
        const targetRoute = getRouteForRole(user.roles);
        router.replace(targetRoute);
        return;
      }
    }
  }, [pathname, isLoading, router, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      await authService.login(credentials);
      const success = loadUserFromToken();

      if (success) {
        const userData = authService.decodeJWT(authService.getToken()!);

        if (userData?.roles && userData.roles.length > 0) {
          const targetRoute = getRouteForRole(userData.roles);
          router.replace(targetRoute);
        } else {
          // Si no tiene roles, ir a página por defecto
          router.replace("/empleado");
        }
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
