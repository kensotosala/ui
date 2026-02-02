// components/nomina-empleado/NominaEmpleadoTable.tsx
"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DollarSign, Calendar, TrendingUp, FileText } from "lucide-react";
import { useNominaEmpleado } from "../../hooks/useNominaEmpleado";
import { NominaDTO } from "../../nomina.types";
import { columnsEmpleado } from "./columns-empleado-nomina";
import { DataTable } from "./data-table";
import { NominaEmpleadoDetailsDialog } from "./dialogs/empleado-details-dialog";

interface NominaEmpleadoTableProps {
  empleadoId: number;
}

export function NominaEmpleadoTable({ empleadoId }: NominaEmpleadoTableProps) {
  const { nominas, isLoading, stats } = useNominaEmpleado(empleadoId);
  const [selectedNomina, setSelectedNomina] = useState<NominaDTO | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const handleVer = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenDetails(true);
  };

  const tableColumns = columnsEmpleado(handleVer);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Nóminas
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalNominas}
            </div>
            <p className="text-xs text-slate-500 mt-1">Registradas</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pendientes
              </CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {stats.pendientes}
            </div>
            <p className="text-xs text-slate-500 mt-1">Por pagar</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-linear-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Pagado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ₡
              {stats.totalPagado.toLocaleString("es-CR", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Acumulado</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Último Pago
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {stats.ultimoPago ? (
              <>
                <div className="text-2xl font-bold text-purple-900">
                  ₡
                  {stats.ultimoPago.totalNeto.toLocaleString("es-CR", {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(
                    stats.ultimoPago.fechaPago || "",
                  ).toLocaleDateString("es-CR")}
                </p>
              </>
            ) : (
              <div className="text-sm text-slate-500">Sin pagos</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Nóminas */}
      {nominas.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">
              No hay nóminas registradas
            </h3>
            <p className="text-muted-foreground mt-2">
              Tus nóminas aparecerán aquí cuando sean generadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mis Nóminas</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={tableColumns} data={nominas} />
          </CardContent>
        </Card>
      )}

      {/* Dialog de Detalles */}
      <NominaEmpleadoDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        nomina={selectedNomina}
      />
    </div>
  );
}
