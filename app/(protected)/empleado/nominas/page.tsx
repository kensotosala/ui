"use client";

import { NominaEmpleadoTable } from "@/app/features/nominas/components/data-table/NominaEmpleadoTable";
import { useAuthContext } from "@/components/providers/AuthProvider";

const NominaPage = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user?.employeeId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          No se encontró información del empleado
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NominaEmpleadoTable empleadoId={user.employeeId} />
    </div>
  );
};

export default NominaPage;
