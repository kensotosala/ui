/* eslint-disable @typescript-eslint/no-explicit-any */
// app/features/aguinaldo/components/data-table/columns-empleado-aguinaldo.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AguinaldoDTO } from "../../types";

const getEstadoBadge = (estado?: string) => {
  const estadoUpper = estado?.toUpperCase() || "PENDIENTE";

  const variants: Record<string, { variant: any; className: string }> = {
    PENDIENTE: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    PAGADO: {
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    ANULADO: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const config = variants[estadoUpper] || variants.PENDIENTE;

  return (
    <Badge variant={config.variant} className={config.className}>
      {estadoUpper}
    </Badge>
  );
};

export const columnsEmpleado = (
  onVer: (aguinaldo: AguinaldoDTO) => void,
): ColumnDef<AguinaldoDTO>[] => [
  {
    accessorKey: "fechaCalculo",
    header: "Año",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaCalculo);
      return <div className="font-medium text-lg">{fecha.getFullYear()}</div>;
    },
  },
  {
    accessorKey: "diasTrabajados",
    header: "Días Trabajados",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold">{row.original.diasTrabajados}</div>
        <div className="text-xs text-muted-foreground">días</div>
      </div>
    ),
  },
  {
    accessorKey: "salarioPromedio",
    header: "Salario Promedio",
    cell: ({ row }) => (
      <div className="text-right font-mono">
        ₡{row.original.salarioPromedio.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "montoAguinaldo",
    header: "Monto Aguinaldo",
    cell: ({ row }) => (
      <div className="text-right font-mono text-lg font-bold text-green-700">
        ₡{row.original.montoAguinaldo.toLocaleString("es-CR")}
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
          {fecha ? (
            <div>
              <div className="font-medium">
                {new Date(fecha).toLocaleDateString("es-CR")}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(fecha).toLocaleDateString("es-CR", {
                  weekday: "long",
                })}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Pendiente</span>
          )}
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
    header: "Acciones",
    cell: ({ row }) => {
      const aguinaldo = row.original;

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVer(aguinaldo)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver Detalles
        </Button>
      );
    },
  },
];
