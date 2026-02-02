"use client";

import { NominaEmpleadoTable } from "@/app/features/nominas/components/data-table/NominaEmpleadoTable";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";

const NominasPage = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <NominaEmpleadoTable empleadoId={user?.employeeId || 0} />
    </div>
  );
};

export default NominasPage;
