"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Calculator, Gift, DollarSign, Users, Clock } from "lucide-react";
import { useAguinaldo } from "../../hooks/useAguinaldo";
import { AguinaldoDTO } from "../../types";
import { DataTable } from "./data-table";
import { CalcularAguinaldoDialog } from "./dialogs/calcular-dialog";
import { AguinaldoDetailsDialog } from "./dialogs/details-dialog";
import { AguinaldoPagarDialog } from "./dialogs/pagar-dialog";
import { AguinaldoAnularDialog } from "./dialogs/anular-dialog";
import { PagarTodosAguinaldosButton } from "./PagarTodosButton";
import { columns } from "./columns";

interface AguinaldoTableProps {
  anio?: number;
}

export function AguinaldoTable({ anio }: AguinaldoTableProps) {
  const currentYear = new Date().getFullYear();
  const year = anio || currentYear;

  const {
    aguinaldos,
    resumen,
    isLoading,
    pagarAguinaldo,
    anularAguinaldo,
    refetch,
  } = useAguinaldo(year);

  const [openCalc, setOpenCalc] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openPagar, setOpenPagar] = useState(false);
  const [openAnular, setOpenAnular] = useState(false);
  const [selected, setSelected] = useState<AguinaldoDTO | null>(null);

  const handleVer = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenDetails(true);
  };

  const handlePagarClick = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenPagar(true);
  };

  const handleAnularClick = (aguinaldo: AguinaldoDTO) => {
    setSelected(aguinaldo);
    setOpenAnular(true);
  };

  const handlePagar = async (id: number, fechaPago: string) => {
    await pagarAguinaldo(id, fechaPago);
    setOpenPagar(false);
    setSelected(null);
  };

  const handleAnular = async (id: number) => {
    await anularAguinaldo(id);
    setOpenAnular(false);
    setSelected(null);
  };

  const tableColumns = columns(handleVer, handlePagarClick, handleAnularClick);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Total Empleados
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {resumen.totalEmpleados}
              </div>
              <p className="text-xs text-blue-700 mt-1">Aguinaldos generados</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-yellow-900">
                  Pendientes
                </CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">
                {resumen.aguinaldosPendientes}
              </div>
              <p className="text-xs text-yellow-700 mt-1">Por pagar</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-linear-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-900">
                  Total Pendiente
                </CardTitle>
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                ₡
                {resumen.totalPendiente.toLocaleString("es-CR", {
                  maximumFractionDigits: 0,
                })}
              </div>
              <p className="text-xs text-orange-700 mt-1">Monto a pagar</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-linear-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-900">
                  Total Pagado
                </CardTitle>
                <Gift className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                ₡
                {resumen.totalPagado.toLocaleString("es-CR", {
                  maximumFractionDigits: 0,
                })}
              </div>
              <p className="text-xs text-green-700 mt-1">
                {resumen.aguinaldosPagados} pagados
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla Principal */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Aguinaldos {year}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {aguinaldos.length} aguinaldo
                {aguinaldos.length !== 1 ? "s" : ""} registrado
                {aguinaldos.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setOpenCalc(true)}
                variant="outline"
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calcular Aguinaldos
              </Button>

              <PagarTodosAguinaldosButton
                aguinaldos={aguinaldos}
                onSuccess={refetch}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {aguinaldos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">
                No hay aguinaldos registrados para {year}
              </h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Calcula y genera los aguinaldos para todos los empleados
              </p>
              <Button
                onClick={() => setOpenCalc(true)}
                className="bg-linear-to-r from-blue-600 to-indigo-600"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calcular Aguinaldos {year}
              </Button>
            </div>
          ) : (
            <DataTable columns={tableColumns} data={aguinaldos} />
          )}
        </CardContent>
      </Card>

      {/* DIÁLOGOS */}
      <CalcularAguinaldoDialog
        open={openCalc}
        onOpenChange={setOpenCalc}
        anio={year}
        onSuccess={refetch}
      />

      <AguinaldoDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        aguinaldo={selected}
      />

      <AguinaldoPagarDialog
        open={openPagar}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenPagar(open);
          if (!open) setSelected(null);
        }}
        aguinaldo={selected}
        onConfirm={handlePagar}
      />

      <AguinaldoAnularDialog
        open={openAnular}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenAnular(open);
          if (!open) setSelected(null);
        }}
        aguinaldo={selected}
        onConfirm={handleAnular}
      />
    </div>
  );
}
