/* eslint-disable @typescript-eslint/no-explicit-any */
// components/nomina-empleado/columns-empleado.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { NominaDTO } from "../../nomina.types";

const getEstadoBadge = (estado?: string) => {
  const estadoUpper = estado?.toUpperCase() || "PENDIENTE";

  const config: Record<string, { variant: any; className: string }> = {
    PENDIENTE: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    PAGADA: {
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    ANULADA: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const selected = config[estadoUpper] || config.PENDIENTE;

  return (
    <Badge variant={selected.variant} className={selected.className}>
      {estadoUpper}
    </Badge>
  );
};

export const columnsEmpleado = (
  onVer: (nomina: NominaDTO) => void,
): ColumnDef<NominaDTO>[] => [
  {
    accessorKey: "periodoNomina",
    header: "Período",
    cell: ({ row }) => {
      const fecha = new Date(row.original.periodoNomina);
      const dia = fecha.getDate();
      const quincena = dia <= 15 ? "1ª" : "2ª";

      return (
        <div>
          <div className="font-medium">
            {quincena} Quincena{" "}
            {fecha.toLocaleDateString("es-CR", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {fecha.toLocaleDateString("es-CR")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "salarioBase",
    header: "Salario Base",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        ₡{row.original.salarioBase.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "montoHorasExtra",
    header: "Horas Extra",
    cell: ({ row }) => {
      const monto = row.original.montoHorasExtra || 0;
      return (
        <div className="text-right font-mono text-sm">
          {monto > 0 ? (
            <span className="text-green-600">
              +₡{monto.toLocaleString("es-CR")}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalBruto",
    header: "Total Bruto",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-semibold">
        ₡{row.original.totalBruto.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "deducciones",
    header: "Deducciones",
    cell: ({ row }) => {
      const deducciones = row.original.deducciones || 0;
      return (
        <div className="text-right font-mono text-sm text-red-600">
          -₡{deducciones.toLocaleString("es-CR")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalNeto",
    header: "Total Neto",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-bold text-green-700">
        ₡{row.original.totalNeto.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "fechaPago",
    header: "Fecha de Pago",
    cell: ({ row }) => {
      const fecha = row.original.fechaPago;
      return (
        <div className="text-sm">
          {fecha ? new Date(fecha).toLocaleDateString("es-CR") : "Por definir"}
        </div>
      );
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => getEstadoBadge(row.original.estado),
  },
  {
    id: "acciones",
    header: "Ver",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVer(row.original)}
        className="h-8"
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];
