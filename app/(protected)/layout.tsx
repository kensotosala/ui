"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import {
  AuthProvider,
  useAuthContext,
} from "@/components/providers/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Rutas públicas que no deben mostrar el layout
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  // Si es ruta pública o no está autenticado, solo mostrar el children
  if (isPublicRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  // Si está autenticado y es ruta privada, mostrar el layout completo
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar fijo arriba */}
          <div className="shrink-0">
            <Navbar />
          </div>

          {/* Contenido scrollable */}
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
